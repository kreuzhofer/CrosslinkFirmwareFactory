/* src/App.js */
import React from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom'
import TopMenu from './TopMenu'
import MarlinFirmwareOverview from './MarlinFirmwareOverview'
import {AddBuildDefinition, BuildDefinitionDetails, BuildDefinitionsList} from './BuildDefinition'
import {
  Grid, 
} from 'semantic-ui-react'

/*
Fix for 404 access denied in amplify deployed app:
https://github.com/aws-amplify/amplify-console/issues/436
*/

const IndexDashboard = () => {
  return (
    <div>
      <p>Welcome to the Crosslink firmware factory (beta)</p>
      <p>Here we provide downloads of pre-configured Marlin firmware for specific printers and setups as well as pre-compiled firmware binaries.</p>
      <p>This website is currently in <strong>beta</strong>, so please excuse roughness in design. Functionality is still limited but you see it first, which is awesome!</p>
      <p>Currently you will find pre-configured firmware in the "<NavLink to="/Marlin">Marlin</NavLink>" section, linked at the top of this page.</p>
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