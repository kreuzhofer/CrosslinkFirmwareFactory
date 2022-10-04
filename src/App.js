/* src/App.js */
import React, {useState} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import BuildDefinitionsList from './components/BuildDefinitionsList'
import { Auth } from 'aws-amplify'
import { useAuthenticator } from '@aws-amplify/ui-react';

import { FirmwareVersionsList } from './components/FirmwareVersionsList'
import { AddFirmwareVersion } from './components/AddFirmwareVersion'
import MarlinFirmwareDownloads from './components/MarlinFirmwareDownloads'
import TopMenu from './components/TopMenu'
import { MembershipExceptionList } from './components/MembershipExceptionList'
import { AddMembershipException } from './components/AddMembershipException'
import { Home } from './components/Home'
import { MarlinFirmwareDetails } from './components/MarlinFirmwareDetails'
import { Login } from './components/Login'
import EditBuildDefinition from './components/EditBuildDefinition'

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

  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  console.log(authStatus);

	if(authStatus === 'authenticated')
  {
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
  }
  return (
    <>
    <Router>
      <Routes>
          <Route path='/' element={<TopMenu patronLevel={patronLevel} isAdmin={isAdmin} />}>
            <Route index element={<Home/>}/>
            <Route path="/Marlin" element={<MarlinFirmwareDownloads patronLevel={patronLevel} isAdmin={isAdmin} />}/>
            <Route path="/Marlin/:id" element={<MarlinFirmwareDetails patronLevel={patronLevel} isAdmin={isAdmin} />}/>

            <Route path="/BuildDefinition" element={<BuildDefinitionsList patronLevel={patronLevel} isAdmin={isAdmin} />}/>
            <Route path="/BuildDefinition/:id" element={<EditBuildDefinition patronLevel={patronLevel} isAdmin={isAdmin} />}/>
            <Route path="/AddBuildDefinition" element={<EditBuildDefinition patronLevel={patronLevel} isAdmin={isAdmin} />}/>
            <Route path="/AddBuildDefinition/:id" element={<EditBuildDefinition patronLevel={patronLevel} clone={true} isAdmin={isAdmin} />}/>

            { isAdmin ? <Route path="/FirmwareVersions" element={<FirmwareVersionsList/>}/> : null }
            { isAdmin ? <Route path="/AddFirmwareVersion" element={<AddFirmwareVersion/>}/> : null }
            { isAdmin ? <Route path="/MembershipExceptions" element={<MembershipExceptionList/>}/> : null }
            { isAdmin ? <Route path="/AddMembershipException" element={<AddMembershipException/>}/> : null }

            <Route path="/login" element={<Login />} />
          </Route>
       </Routes>
    </Router>
    </>
  )
}

export default App