import React, { useEffect, useState } from 'react'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import {NavLink} from 'react-router-dom'
import {
    Header, 
    Segment, 
    Button,
    Table,
    Icon,
    Confirm,
  } from 'semantic-ui-react'

import * as customqueries from './graphql/customqueries'
import * as mutations from './graphql/mutations'
import * as subscriptions from './graphql/subscriptions'
import * as comparator from './util/comparator';
//import Lambda from 'aws-sdk/clients/lambda';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
const buildAgentJobQueueUrl = process.env["REACT_APP_BUILDAGENTJOBQUEUEURL"]
console.log(buildAgentJobQueueUrl)
const buildArtifactsBucketUrl = "https://s3firmwarefactory185231-prod.s3-eu-west-1.amazonaws.com/"

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

        const updateBuildJobSubscription = await API.graphql(graphqlOperation(subscriptions.onUpdateBuildJob, {owner: username})).subscribe({
            next: async (eventData) => {
                await reloadData();
            }
        })
        subs.push(updateBuildJobSubscription);

      }
      fetchData();

      console.log(process.env)

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

    const buildJobsList = (jobs, def) => {
        console.info(jobs)
        if(jobs == null)
            return null;
        return jobs.sort(comparator.makeComparator('createdAt')).slice(0,3).map(job=>
            <Table.Row key={job.id}>
                <Table.Cell>{job.createdAt}</Table.Cell>
                <Table.Cell>{job.jobState}</Table.Cell>
                <Table.Cell><a target="_blank" rel="noopener noreferrer" href={buildArtifactsBucketUrl+'public/'+job.id+'/logfile.txt'}>Log</a></Table.Cell>
                <Table.Cell><a target="_blank" rel="noopener noreferrer" href={buildArtifactsBucketUrl+'public/'+job.id+'/firmware.hex'}>Firmware.hex</a></Table.Cell>
                <Table.Cell><a target="_blank" rel="noopener noreferrer" href={buildArtifactsBucketUrl+'public/'+job.id+'/firmware.bin'}>Firmware.bin</a></Table.Cell>
                <Table.Cell><a target="_blank" rel="noopener noreferrer" href={buildArtifactsBucketUrl+'public/'+job.id+'/marlin.zip'}>Marlin.zip</a></Table.Cell>
            </Table.Row>
        )
    }
  
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
          QueueUrl: buildAgentJobQueueUrl
        };
        
        var credentials = await Auth.currentCredentials()
        console.info(credentials)
        var sqs = new AWS.SQS({apiVersion: '2012-11-05', credentials: Auth.essentialCredentials(credentials)});

        // // test calling a lambda function
        // const lambda = new Lambda({
        //   credentials: Auth.essentialCredentials(credentials)
        // });
        // var lambdaResult = lambda.invoke({
        //   FunctionName: 'AddBuildDefinitionFromWebHook-prod',
        //   Payload: JSON.stringify({ "hello": "world" })
        // }, (err, data) => {
        //   console.info(err)
        //   console.info(data)
        // });
        // console.info(lambdaResult);

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
          <Table.Cell><NavLink to={`/BuildDefinition/${def.id}`}>{def.name}</NavLink><br/><br/>{def.description}</Table.Cell>
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
              <Table celled>
                    <Table.Body>
                        {buildJobsList(def.buildJobs.items, def)}
                    </Table.Body>
              </Table>
          </Table.Cell>
        </Table.Row>)
    }
  
    return (
      <Segment>
        <Header as='h3'>My Build Definitions</Header>
        <Button icon="refresh"></Button>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
              <Table.HeaderCell>Build Jobs</Table.HeaderCell>
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