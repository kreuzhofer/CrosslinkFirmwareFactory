import React, { useEffect, useState } from 'react'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import {NavLink} from 'react-router-dom'
import {
    Header, 
    Input, 
    List, 
    Segment, 
    Button,
    Form,
    Table,
    Icon,
    Confirm
  } from 'semantic-ui-react'
import TextareaAutosize from 'react-textarea-autosize';

import * as customqueries from './graphql/customqueries'
import * as queries from './graphql/queries'
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
          if(item.buildJobs.items.length>0 && (item.buildJobs.items.filter(item=>item.jobState!="DONE" && item.jobState!="FAILED").length>0))
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
        const user = await Auth.currentUserInfo();
        console.info("User : "+ JSON.stringify(user));
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
  
const AddBuildDefinition = () => {
    const [name, setName] = useState('');
    const [sourceTree, setSourceTree] = useState('');
    const [configTree, setConfigTree] = useState('');
    const [printerManufacturer, setPrinterManufacturer] = useState('')
    const [printerModel, setPrinterModel] = useState('')
    const [printerMainboard, setPrinterMainboard] = useState('')
    const [platformioEnv, setPlatformioEnv] = useState('')
    const [description, setDescription] = useState('')
    const [configurationJSON, setConfigurationJSON] = useState('{}')

    const handleSubmit = async(event) => {
        event.preventDefault();
        if(name === '' || sourceTree === '' || configTree === '')
        {
        alert("All fields have to be filled")
        return false
        }
        let result = await API.graphql(graphqlOperation(mutations.createBuildDefinition, {input: {
            name, sourceTree, configTree, printerManufacturer, printerModel, printerMainboard, platformioEnv, description, configurationJSON
        }}));
        console.log(result);
        console.log("ID : "+result.data.createBuildDefinition.id)
        setName('')
    }

    return (
        <Segment>
        <Form>
        <Header as='h3'>Add a new build definition</Header>
        <Input
            type='text'
            label='New Build Definition Name'
            placeholder='New Build Definition Name'
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}/><br/>
        <Input
            label='Source tree URL'
            type='text'
            placeholder='Source tree URL'
            name='sourceTree'
            value={sourceTree}
            onChange={(e) => setSourceTree(e.target.value)}
        /><br/>
        <Input
            type='text'
            label='Config tree URL'
            placeholder='Config tree URL'
            name='configTree'
            value={configTree}
            onChange={(e) => setConfigTree(e.target.value)}
        /><br/>
        <Input
            type='text'
            label='Printer manufacturer'
            placeholder='Printer manufacturer'
            name='printerManufacturer'
            value={printerManufacturer}
            onChange={(e) => setPrinterManufacturer(e.target.value)}
        /><br/>
        <Input
            type='text'
            label='Printer model'
            placeholder='Printer model'
            name='printerModel'
            value={printerModel}
            onChange={(e) => setPrinterModel(e.target.value)}
        /><br/>
        <Input
            type='text'
            label='Printer mainboard type'
            placeholder='Printer mainboard type'
            name='printerMainboard'
            value={printerMainboard}
            onChange={(e) => setPrinterMainboard(e.target.value)}
        /><br/>
        <Input
            type='text'
            label='Platformio Environment'
            placeholder='Platformio Environment'
            name='platformioEnv'
            value={platformioEnv}
            onChange={(e) => setPlatformioEnv(e.target.value)}
        /><br/>          
        <TextareaAutosize
            label='Description'
            placeholder='Description'
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        /><br/>
        <TextareaAutosize
            label='Config JSON'
            placeholder='Config JSON'
            name='configurationJSON'
            value={configurationJSON}
            onChange={(e) => setConfigurationJSON(e.target.value)}
        /><br/>

        <Button
            content='Create'
            onClick={handleSubmit}
        />
        </Form>
        </Segment>
        );
    }
  
const BuildDefinitionDetails = (props) => {
    const [ID, setID] = useState('');
    const [name, setName] = useState('');
    const [sourceTree, setSourceTree] = useState('');
    const [configTree, setConfigTree] = useState('');
    const [printerManufacturer, setPrinterManufacturer] = useState('')
    const [printerModel, setPrinterModel] = useState('')
    const [printerMainboard, setPrinterMainboard] = useState('')
    const [platformioEnv, setPlatformioEnv] = useState('')
    const [description, setDescription] = useState('')
    const [configurationJSON, setConfigurationJSON] = useState('{}')
    let id = props.match.params.id
  
    useEffect(() => {
      async function fetchData() {
        try {
          const result = await API.graphql(graphqlOperation(queries.getBuildDefinition, {id: id}));
          const buildDefinition = result.data.getBuildDefinition
          setID(buildDefinition.id)
          setName(buildDefinition.name)
          setSourceTree(buildDefinition.sourceTree)
          setConfigTree(buildDefinition.configTree)
          setPrinterManufacturer(buildDefinition.printerManufacturer)
          setPrinterModel(buildDefinition.printerModel)
          setPrinterMainboard(buildDefinition.printerMainboard)
          setPlatformioEnv(buildDefinition.platformioEnv)
          setDescription(buildDefinition.description)
          setConfigurationJSON(buildDefinition.configurationJSON)
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
    }, [])

    const handleSubmit = async(event) => {
        event.preventDefault();
        if(name === '' || sourceTree === '' || configTree === '')
        {
        alert("All fields have to be filled")
        return false
        }
        let result = await API.graphql(graphqlOperation(mutations.updateBuildDefinition, {input: {
          id:ID, name, sourceTree, configTree, printerManufacturer, printerModel, printerMainboard, platformioEnv, description, configurationJSON
        }}));
        console.log(result);
        alert("Changes saved")
    }    

    return (
        <Segment>
        <NavLink to="/BuildDefinition">Back</NavLink>
        <Form>
        <Header as='h3'>Edit build definition</Header>
        <Input
            type='text'
            label='Build Definition Name'
            placeholder='Build Definition Name'
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}/>
        <br/>
        <Input
            label='Source tree URL'
            type='text'
            placeholder='Source tree URL'
            name='sourceTree'
            value={sourceTree}
            onChange={(e) => setSourceTree(e.target.value)}
        /><br/>
        <Input
            type='text'
            label='Config tree URL'
            placeholder='Config tree URL'
            name='configTree'
            value={configTree}
            onChange={(e) => setConfigTree(e.target.value)}
        /><br/>

        <Input
            type='text'
            label='Printer manufacturer'
            placeholder='Printer manufacturer'
            name='printerManufacturer'
            value={printerManufacturer}
            onChange={(e) => setPrinterManufacturer(e.target.value)}
        /><br/>
        <Input
            type='text'
            label='Printer model'
            placeholder='Printer model'
            name='printerModel'
            value={printerModel}
            onChange={(e) => setPrinterModel(e.target.value)}
        /><br/>
        <Input
            type='text'
            label='Printer mainboard type'
            placeholder='Printer mainboard type'
            name='printerMainboard'
            value={printerMainboard}
            onChange={(e) => setPrinterMainboard(e.target.value)}
        /><br/>
        <Input
            type='text'
            label='Platformio Environment'
            placeholder='Platformio Environment'
            name='platformioEnv'
            value={platformioEnv}
            onChange={(e) => setPlatformioEnv(e.target.value)}
        /><br/>        
        <TextareaAutosize
            label='Description'
            placeholder='Description'
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        /><br/>
        <TextareaAutosize
            label='Config JSON'
            placeholder='Config JSON'
            name='configurationJSON'
            value={configurationJSON}
            onChange={(e) => setConfigurationJSON(e.target.value)}
        /><br/>            
        <Button
            content='Update'
            onClick={handleSubmit}
        />
        </Form>
        </Segment>
        );
  }

export { BuildDefinitionDetails, AddBuildDefinition, BuildDefinitionsList }