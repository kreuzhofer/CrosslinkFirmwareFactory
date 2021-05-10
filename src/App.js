/* src/App.js */
import React, {useState} from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom'
import TopMenu from './components/TopMenu'
import MarlinFirmwareDownloads from './MarlinFirmwareDownloads'
import {AddBuildDefinition, BuildDefinitionDetails} from './BuildDefinition'
import {BuildDefinitionsList} from './BuildDefinitionsList'
import {
  Grid, 
} from 'semantic-ui-react'
import { Auth } from 'aws-amplify'
import { FirmwareVersionsList } from './components/FirmwareVersionsList'

/*
Fix for 404 access denied in amplify deployed app:
https://github.com/aws-amplify/amplify-console/issues/436
*/

const IndexDashboard = () => {
  return (
    <div>
      <p>Welcome to the Crosslink firmware factory (alpha)</p>
      <p>Here we provide downloads of pre-configured Marlin firmware for specific printers and setups as well as pre-compiled firmware binaries.</p>
      <p>This website is currently in <strong>alpha</strong> testing, so please excuse roughness in design, all kinds of bugs and quirks. Functionality is still limited but you see it first, which is awesome!</p>
      <p>Use the firmware with the fact in mind that I am not taking <strong>ANY</strong> responsibility for any damage possibly happening to your 3D printer or mainboard if you use firmware from this website.</p>
      <p>I am also not obliged to provide any kind of firmware or configuration at any given time if it is still missing here. The timeframe in which this project is coming to reality is still undefined so there is no guarantee or warranty to be applied to any kind of deliverables or missing features whatsoever.</p>
      <p>However, of course you can ping me directly via our <a href="https://discord.gg/AGCQmW4C">discord server in the "#firmware-factory-alpha" channel</a></p>
      <p>Currently you will find pre-configured firmware in the "<NavLink to="/Marlin">Marlin</NavLink>" section, linked at the top of this page.</p>
    </div>
  )
}

const App = () => {
  const [authState, setAuthState] = useState(false)
  const [isAdmin, setisAdmin] = useState(false)

  Auth.currentAuthenticatedUser().then((user)=>{
    const groups = user.signInUserSession.accessToken.payload["cognito:groups"]
    console.info(groups)
    if(groups && groups.filter(f=>f === "Admin").length>0)
      setisAdmin(true)
    setAuthState(true)
  });
  if(!authState)
  {
    return null;
  }
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
            <Route path="/Marlin" exact component={MarlinFirmwareDownloads}/>
            { isAdmin ? <Route path="/BuildDefinition" exact component={AddBuildDefinition}/> : null }
            { isAdmin ? <Route path="/BuildDefinition" exact render={(props) => (<BuildDefinitionsList {...props} isAdmin={isAdmin} /> )} /> : null }
            { isAdmin ? <Route path="/BuildDefinition/:id" component={BuildDefinitionDetails}/> : null }
            { isAdmin ? <Route path="/FirmwareVersions" exact component={FirmwareVersionsList}/> : null }
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