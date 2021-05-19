/* src/App.js */
import React, {useState} from 'react'
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom'
import {EditBuildDefinition} from './components/EditBuildDefinition'
import {BuildDefinitionsList} from './components/BuildDefinitionsList'
import {
  Grid, 
} from 'semantic-ui-react'
import { Auth } from 'aws-amplify'
import { FirmwareVersionsList } from './components/FirmwareVersionsList'
import { AddFirmwareVersion } from './components/AddFirmwareVersion'
import { MarlinFirmwareDownloads } from './components/MarlinFirmwareDownloads'
import { AddBuildDefinition } from './components/AddBuildDefinition'
import { TopMenu } from './components/TopMenu.jsx'

const buildAgentJobQueueUrl = process.env["REACT_APP_BUILDAGENTJOBQUEUEURL"]
//console.log(buildAgentJobQueueUrl)
const buildJobTableName = process.env["REACT_APP_BUILDJOBTABLENAME"]
//console.log(buildJobTableName)
const buildDefinitionTableName = process.env["REACT_APP_BUILDDEFINITIONTABLENAME"]
//console.log(buildDefinitionTableName)
const graphQLApiUrl = process.env["REACT_APP_GRAPHQLAPIURL"]
//console.log(graphQLApiUrl);
const buildArtifactsBucket = process.env["REACT_APP_BUILDARTIFACTS_BUCKET"]
//console.log(buildArtifactsBucket);

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
      <p>However, of course you can ping me directly via our <a href="https://discord.gg/ne3J4Rf">discord server in the "#firmware-factory-alpha" channel</a></p>
      <p>Currently you will find pre-configured firmware in the "<NavLink to="/Marlin">Marlin</NavLink>" section, linked at the top of this page.</p>
    </div>
  )
}

const App = () => {
  const [authState, setAuthState] = useState(false)
  const [isAdmin, setisAdmin] = useState(false)
	const [patronLevel, setPatronLevel] = useState(0);

	Auth.currentSession().then(data => {
		//console.log("data: ");
		//console.log(data);
		if(data.idToken.payload.patron_level)
			setPatronLevel(data.idToken.payload.patron_level);
		console.log("Patron level: "+patronLevel);
		//console.log(data.accessToken);
		function parseJwt (token) {
			var base64Url = token.split('.')[1];
			var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
	
			return JSON.parse(jsonPayload);
		};
		//console.log(parseJwt(data.accessToken.jwtToken));
	});

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
      <TopMenu isAdmin={isAdmin} patronLevel={patronLevel}/>
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            {/* This is a spacer */}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Route path="/" exact component={IndexDashboard}/>
            <Route path="/Marlin" exact render={(props)=>(<MarlinFirmwareDownloads {...props} patronLevel={patronLevel} />)} />
            { patronLevel >= 2 || isAdmin ? <Route path="/BuildDefinition" exact render={(props) => (<BuildDefinitionsList {...props} isAdmin={isAdmin} /> )} /> : null }
            { patronLevel >= 2 || isAdmin ? <Route path="/BuildDefinition/:id" render={(props)=>(<EditBuildDefinition {...props} isAdmin={isAdmin} />)}/> : null }
            { patronLevel >= 2 || isAdmin ? <Route path="/AddBuildDefinition" exact component={AddBuildDefinition}/> : null }
            { patronLevel >= 2 || isAdmin ? <Route path="/AddBuildDefinition/:id" component={AddBuildDefinition}/> : null }
            { isAdmin ? <Route path="/FirmwareVersions" exact component={FirmwareVersionsList}/> : null }
            { isAdmin ? <Route path="/AddFirmwareVersion" exact component={AddFirmwareVersion}/> : null }
          </Grid.Column>
         </Grid.Row>
       </Grid>
    </Router>
    
  )
}

export default App