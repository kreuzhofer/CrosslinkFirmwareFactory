import React, { useEffect, useState } from 'react'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import {NavLink} from 'react-router-dom'
import {
    Header, 
    Segment, 
    Button,
    Table,
    Icon,
    Confirm
  } from 'semantic-ui-react'

import * as customqueries from './graphql/customqueries'
import * as mutations from './graphql/mutations'
import * as subscriptions from './graphql/subscriptions'
import * as comparator from './util/comparator';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
AWS.config.update({credentials: {accessKeyId: 'AKIAWCBLZQYWFG3EF247', secretAccessKey:'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'}});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const BuildDefinitionsList = () => {
    const [buildDefinitions, setBuildDefinitions] = useState([])
    const [confirmState, setConfirmState] = useState({ open: false })

    const reloadData = async()=>{
      try {
        const result = await API.graphql(graphqlOperation(customqueries.listBuildDefinitionsWithJobs, {limit: 999}));
        var items = result.data.listBuildDefinitions.items
        items.forEach(item => {
          if(item.buildJobs.items.length>0 && (item.buildJobs.items.filter(item=>item.jobState!=="DONE" && item.jobState!=="FAILED").length>0))
            item.buildRunning = true;
        });
        console.info(items);
        setBuildDefinitions(items);
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      const subs = [];
      async function fetchData() {
        await reloadData();
        const user =  await Auth.currentAuthenticatedUser();
        const username = user.username;

        const insertSubscription = await API.graphql(graphqlOperation(subscriptions.onCreateBuildDefinition, {owner: username})).subscribe({
          next: (eventData) => {
            const buildDefinition = eventData.value.data.onCreateBuildDefinition
            setBuildDefinitions(buildDefinitions => [...buildDefinitions, buildDefinition])
          }
        })
        subs.push(insertSubscription);
        const deleteSubscription = await API.graphql(graphqlOperation(subscriptions.onDeleteBuildDefinition, {owner: username})).subscribe({
          next: (eventData) => {
            setBuildDefinitions(buildDefinitions => buildDefinitions.filter(item => item.id !== eventData.value.data.onDeleteBuildDefinition.id));
          }
        })
        subs.push(deleteSubscription);
      }
      fetchData();
      return () => {
        subs.forEach(function(item, index, array){
          item.unsubscribe();
        })
      }
    }, [])

    const handleConfirm = async() => {
      try {
        const result = await API.graphql(graphqlOperation(mutations.deleteBuildDefinition, {input: {id: confirmState.id}}));
        console.info(result)
      } catch (error) {
        console.error(error);
      }
      setConfirmState({ open: false })
    }
    const handleCancel = () => setConfirmState({ open: false })
  
    const buildDefinitionItems = () => {
  
      // see https://reactjs.org/docs/handling-events.html
      const handleDelete = (event, id) => {
        console.info("clicked delete "+id);
        setConfirmState({open: true, id: id});
      }

      const handleBuild = async(event, def) => {
        event.preventDefault();
        console.info("clicked build "+def.id);
        let buildDefinitionID = def.id;

        // store build job in database (used to be in the lambda, now here)
        let result = await API.graphql(graphqlOperation(mutations.createBuildJob, {
          input: {
            buildDefinitionID,
            jobState: 'QUEUED'
        }}));
        console.log(result);
        console.log(result.data.createBuildJob.id)

        // send message to lambda function to process next job
        var params = {
          DelaySeconds: 0,
          MessageAttributes: {
            "buildJobId": {
              DataType: "String",
              StringValue: ""+result.data.createBuildJob.id
            }
          },
          MessageBody: "Build queued for buildDefinition "+def.id,
          QueueUrl: "https://sqs.eu-west-1.amazonaws.com/416703677996/BuildAgentJobQueue"
        };
        
        sqs.sendMessage(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data.MessageId);
          }
        });
        await reloadData();
        console.log(buildDefinitions)
      }
  
      return buildDefinitions
        .sort(comparator.makeComparator('name'))
        .map(def => 
        <Table.Row key={def.id}>
          <Table.Cell><NavLink to={`/BuildDefinition/${def.id}`}>{def.name}</NavLink></Table.Cell>
          <Table.Cell>
          <Button loading={def.buildRunning} disabled={def.buildRunning} animated='vertical' onClick={(e)=>handleBuild(e, def)}>
              <Button.Content hidden>Build</Button.Content>
              <Button.Content visible><Icon name='cubes'/></Button.Content>
          </Button>
          <Button disabled={def.buildRunning} animated='vertical' onClick={(e)=>handleDelete(e, def.id)} color='red'>
            <Button.Content hidden>Delete</Button.Content>
            <Button.Content visible><Icon name='delete'/></Button.Content>
          </Button>
          </Table.Cell>
          <Table.Cell>
            {def.buildJobs.items.length>0 ? def.buildJobs.items[0].jobState : ''}
          </Table.Cell>
          <Table.Cell>
          </Table.Cell>
        </Table.Row>)

    }
  
    return (
      <Segment>
        <Header as='h3'>My Build Definitions</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
              <Table.HeaderCell>State</Table.HeaderCell>
              <Table.HeaderCell>Artifacts</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {buildDefinitionItems()}
          </Table.Body>
        </Table>
        <Confirm
            open={confirmState.open}
            cancelButton='Never mind'
            confirmButton="Yes"
            onCancel={handleCancel}
            onConfirm={handleConfirm}
          />
      </Segment>
    );
  }

export { BuildDefinitionsList }