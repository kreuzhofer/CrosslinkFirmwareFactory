import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import {NavLink} from 'react-router-dom'
import {
    Header, 
    Input, 
    Segment, 
    Button,
    Form,
    Label,
  } from 'semantic-ui-react'
import TextareaAutosize from 'react-textarea-autosize';

import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations'

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
        <Label>Description</Label>
        <TextareaAutosize
            label='Description'
            placeholder='Description'
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        /><br/>
        <Label>Config JSON</Label>
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
    const [dataLoaded, setDataLoaded] = useState(false)
    const [sharedWithEveryone, setSharedWithEveryone] = useState(false)
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
          setSharedWithEveryone(buildDefinition.groupsCanAccess.includes("Everyone"))
        } catch (error) {
          console.error(error);
        }
      }
      if(!dataLoaded){
        fetchData()
        setDataLoaded(true);
      };
    }, [dataLoaded, id])

    const handleSubmit = async(event) => {
        event.preventDefault();
        if(name === '' || sourceTree === '' || configTree === '')
        {
        alert("All fields have to be filled")
        return false
        }
        let groupsCanAccess = sharedWithEveryone ? ["Everyone"] : [];
        let result = await API.graphql(graphqlOperation(mutations.updateBuildDefinition, {input: {
          id:ID, name, sourceTree, configTree, printerManufacturer, printerModel, printerMainboard, platformioEnv:platformioEnv, description, configurationJSON, groupsCanAccess
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
        <Label>Description</Label>
        <TextareaAutosize
            label='Description'
            placeholder='Description'
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        /><br/>
        <Label>Config JSON</Label>
        <TextareaAutosize
            label='Config JSON'
            placeholder='Config JSON'
            name='configurationJSON'
            value={configurationJSON}
            onChange={(e) => setConfigurationJSON(e.target.value)}
        /><br/>
        <Input 
            type='Checkbox'
            label='Shared with everyone'
            name='sharedWithEveryone'
            checked={sharedWithEveryone}
            onChange={(e)=>setSharedWithEveryone(e.target.checked)}
            >
        </Input><br/><br/>
        <Button
            content='Save'
            onClick={handleSubmit}
        />
        </Form>
        </Segment>
        );
  }

export { BuildDefinitionDetails, AddBuildDefinition }