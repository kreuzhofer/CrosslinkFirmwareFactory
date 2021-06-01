/* src/App.js */
import React, {useState} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
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
import { MembershipExceptionList } from './components/MembershipExceptionList'
import { AddMembershipException } from './components/AddMembershipException'
import { Home } from './components/Home'

//const buildAgentJobQueueUrl = process.env["REACT_APP_BUILDAGENTJOBQUEUEURL"]
//console.log(buildAgentJobQueueUrl)
//const buildJobTableName = process.env["REACT_APP_BUILDJOBTABLENAME"]
//console.log(buildJobTableName)
//const buildDefinitionTableName = process.env["REACT_APP_BUILDDEFINITIONTABLENAME"]
//console.log(buildDefinitionTableName)
//const graphQLApiUrl = process.env["REACT_APP_GRAPHQLAPIURL"]
//console.log(graphQLApiUrl);
//const buildArtifactsBucket = process.env["REACT_APP_BUILDARTIFACTS_BUCKET"]
//console.log(buildArtifactsBucket);

/*
Fix for 404 access denied in amplify deployed app:
https://github.com/aws-amplify/amplify-console/issues/436
*/

const App = () => {
  const [authState, setAuthState] = useState(false)
  const [isAdmin, setisAdmin] = useState(false)
	const [patronLevel, setPatronLevel] = useState(0);

	Auth.currentSession().then(data => {
		//console.log("data: ");
		//console.log(data);
		if(data.idToken.payload.patron_level)
			setPatronLevel(data.idToken.payload.patron_level);
		//console.log("Patron level: "+patronLevel);
		//console.log(data.accessToken);
/* 		function parseJwt (token) {
			var base64Url = token.split('.')[1];
			var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
	
			return JSON.parse(jsonPayload);
		}; */
		//console.log(parseJwt(data.accessToken.jwtToken));
	});

  Auth.currentAuthenticatedUser().then((user)=>{
    const groups = user.signInUserSession.accessToken.payload["cognito:groups"]
    //console.info(groups)
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
            <Route path="/" exact component={Home}/>
            <Route path="/Marlin" exact render={(props)=>(<MarlinFirmwareDownloads {...props} patronLevel={patronLevel} />)} />
            { patronLevel >= 2 || isAdmin ? <Route path="/BuildDefinition" exact render={(props) => (<BuildDefinitionsList {...props} isAdmin={isAdmin} /> )} /> : null }
            { patronLevel >= 2 || isAdmin ? <Route path="/BuildDefinition/:id" render={(props)=>(<EditBuildDefinition {...props} isAdmin={isAdmin} />)}/> : null }
            { patronLevel >= 2 || isAdmin ? <Route path="/AddBuildDefinition" exact component={AddBuildDefinition}/> : null }
            { patronLevel >= 2 || isAdmin ? <Route path="/AddBuildDefinition/:id" component={AddBuildDefinition}/> : null }
            { isAdmin ? <Route path="/FirmwareVersions" exact component={FirmwareVersionsList}/> : null }
            { isAdmin ? <Route path="/AddFirmwareVersion" exact component={AddFirmwareVersion}/> : null }
            { isAdmin ? <Route path="/MembershipExceptions" exact component={MembershipExceptionList}/> : null }
            { isAdmin ? <Route path="/AddMembershipException" exact component={AddMembershipException}/> : null }
          </Grid.Column>
         </Grid.Row>
       </Grid>
    </Router>
    
  )
}

export default App