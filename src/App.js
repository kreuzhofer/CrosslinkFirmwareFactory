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

import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'
import * as subscriptions from './graphql/subscriptions'
import * as comparator from './util/comparator';

const BuildDefinitionsList = () => {
  const [buildDefinitions,
    setBuildDefinitions] = useState([])

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
    return buildDefinitions
      .sort(comparator.makeComparator('name'))
      .map(def => <List.Item key={def.id}>
        <NavLink to={`/buildDefinitions/${def.id}`}>{def.name}</NavLink>
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
            <Route path="/" exact component={AddBuildDefinition}/>
            <Route path="/" exact component={BuildDefinitionsList}/>
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