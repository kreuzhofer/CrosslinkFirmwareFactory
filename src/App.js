/* src/App.js */
import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'
import {
  Grid, 
  Header, 
  Input, 
  List, 
  Segment, 
  Button,
} from 'semantic-ui-react'
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom'
import TopMenu from './TopMenu'
import MarlinFirmwareOverview from './MarlinFirmwareOverview'

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
  
  const handleSubmit = async(event) => {
    event.preventDefault();
    if(name === '' || sourceTree === '' || configTree === '')
    {
      alert("All fields have to be filled")
      return false
    }
    let result = await API.graphql(graphqlOperation(mutations.createBuildDefinition, {input: {
        name, sourceTree, configTree
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

const IndexDashboard = () => {
  return (
    <div>
      <p>Welcome to the Crosslink firmware factory (beta)</p>
      <p>Here we provide downloads of pre-configured Marlin firmware for specific printers and setups as well as pre-compiled firmware binaries.</p>
      <p>This website is currently in <strong>beta</strong>, so please excuse roughness in design. Functionality is still limited but you see it first, which is awesome!</p>
      <p>Currently you will find pre-configured firmware in the "<NavLink to="/Marlin">Marlin</NavLink>" section, linked at the top of this page</p>
    </div>
  )
}


const App = () => {

  return (
    <Router>
      <TopMenu/>
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            {/* This is a spacer */}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Route path="/" exact component={IndexDashboard}/>
            <Route path="/Marlin" exact component={MarlinFirmwareOverview}/>
            <Route path="/BuildDefinition" exact component={AddBuildDefinition}/>
            <Route path="/BuildDefinition" exact component={BuildDefinitionsList}/>
            <Route path="/BuildDefinition/:id" component={BuildDefinitionDetails}/>
          </Grid.Column>
         </Grid.Row>
       </Grid>
    </Router>
    
  )
}

export default withAuthenticator(App, {
   includeGreetings: true,
   signUpConfig: {
     hiddenDefaults: ["phone_number"]
   }
});