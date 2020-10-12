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

import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'
import * as subscriptions from './graphql/subscriptions'
import * as comparator from './util/comparator';

const BuildDefinitionsList = () => {
    const [buildDefinitions, setBuildDefinitions] = useState([])
    const [confirmState, setConfirmState] = useState({ open: false })
  
    useEffect(() => {
      const subs = [];
      async function fetchData() {
        try {
          const result = await API.graphql(graphqlOperation(queries.listBuildDefinitions, {limit: 999}));
          setBuildDefinitions(result.data.listBuildDefinitions.items)        
        } catch (error) {
          console.error(error);
        }
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
  
      return buildDefinitions
        .sort(comparator.makeComparator('name'))
        .map(def => 
        <Table.Row key={def.id}>
          <Table.Cell><NavLink to={`/BuildDefinition/${def.id}`}>{def.name}</NavLink></Table.Cell>
          <Table.Cell>
          <Button animated='vertical'>
              <Button.Content hidden>Build</Button.Content>
              <Button.Content visible><Icon name='cubes'/></Button.Content>
          </Button>
          <Button animated='vertical' onClick={(e)=>handleDelete(e, def.id)} color='red'>
            <Button.Content hidden>Delete</Button.Content>
            <Button.Content visible><Icon name='delete'/></Button.Content>
          </Button>
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
            name, sourceTree, configTree, printerManufacturer, printerModel, printerMainboard, configurationJSON
        }}));
        console.log(result);
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
          id:ID, name, sourceTree, configTree, printerManufacturer, printerModel, printerMainboard, description, configurationJSON
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