import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import {NavLink} from 'react-router-dom'
import {
    Header, 
    Input, 
    List, 
    Segment, 
    Button,
  } from 'semantic-ui-react'
import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'
import * as subscriptions from './graphql/subscriptions'
import * as comparator from './util/comparator';

const BuildDefinitionsList = () => {
    const [buildDefinitions, setBuildDefinitions] = useState([])
  
    useEffect(() => {
      async function fetchData() {
        try {
          const result = await API.graphql(graphqlOperation(queries.listBuildDefinitions, {limit: 999}));
          setBuildDefinitions(result.data.listBuildDefinitions.items)        
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
    }, [])
  
    const albumItems = () => {
  
      // see https://reactjs.org/docs/handling-events.html
      const handleDelete = async(event, id) => {
        try {
          console.info("clicked delete "+id)
          const result = await API.graphql(graphqlOperation(mutations.deleteBuildDefinition, {input: {id: id}}));
          console.info(result)
        } catch (error) {
          console.error(error);
        }
      }
  
      return buildDefinitions
        .sort(comparator.makeComparator('name'))
        .map(def => <List.Item key={def.id}>
          <NavLink to={`/BuildDefinition/${def.id}`}>{def.name}</NavLink><Button icon='delete' onClick={(e)=>handleDelete(e, def.id)} />
        </List.Item>)
      }
  
    return (
      <Segment>
        <Header as='h3'>My Build Definitions</Header>
        <List divided relaxed>
          {albumItems()}
        </List>
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
        </Segment>
        );
    }
  
const BuildDefinitionDetails = (props) => {
    const [buildDefinition, setBuildDefinition] = useState([])
    let id = props.match.params.id
  
    useEffect(() => {
      async function fetchData() {
        try {
          const result = await API.graphql(graphqlOperation(queries.getBuildDefinition, {id: id}));
          setBuildDefinition(result.data.getBuildDefinition)        
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
    }, [])
  
    return (
      <h1>{buildDefinition.name}</h1>
    )
  }

export { BuildDefinitionDetails, AddBuildDefinition, BuildDefinitionsList }