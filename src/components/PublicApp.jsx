import React from 'react'
import { TopMenu } from './TopMenu.jsx'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {
  Grid, 
} from 'semantic-ui-react'
import { Auth } from 'aws-amplify'
import { Home } from './Home.jsx';
import { MarlinFirmwareDownloads } from './MarlinFirmwareDownloads.jsx'

// See https://dev.to/awshanks/aws-amplify-mixed-public-private-application-routing-1d9b
// for public/private app example

export class PublicApp extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			authState: false,
			isAdmin: false,
			patronLevel: 0
		}

		Auth.currentSession().then(data => {
			//console.log("data: ");
			//console.log(data);
			if(data.idToken.payload.patron_level)
				this.setState({ patronLevel: data.idToken.payload.patron_level });
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
		}, reason => {
			console.error(reason);
		});
	
		Auth.currentAuthenticatedUser().then((user)=>{
			const groups = user.signInUserSession.accessToken.payload["cognito:groups"]
			//console.info(groups)
			if(groups && groups.filter(f=>f === "Admin").length>0)
				this.setState({isAdmin: true});
			this.setState({authState: true})
		}, reason => {
			console.error(reason);
		});

	}

	render() {
		return (
			<Router>
				<TopMenu isAdmin={this.state.isAdmin} patronLevel={this.state.patronLevel} authState={this.state.authState}/>
				<Grid padded>
        <Grid.Row>
          <Grid.Column>
            {/* This is a spacer */}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
						<Switch>
							<Route path="/" exact component={Home}/>
							<Route path="/Marlin" exact render={(props)=>(<MarlinFirmwareDownloads {...props} patronLevel={this.state.patronLevel} />)} />
						</Switch>
          </Grid.Column>
         </Grid.Row>
       </Grid>
			</Router>
		);
	}
}