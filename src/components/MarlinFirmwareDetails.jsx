import React from 'react'
import { API, graphqlOperation, Storage } from 'aws-amplify'
import {
    Header, 
    Segment, 
    Table,
    Button,
    Icon,
    Search
  } from 'semantic-ui-react'
import * as queries from '../graphql/queries'

import mixpanel from 'mixpanel-browser';
mixpanel.init('b797e33ed9db411af6893878c06f6522');
	
export class MarlinFirmwareDetails extends React.Component
{
	constructor(props){
		super(props);
		this.state = {
		};
	}

	async reloadData() {
		try {
      	const result = await API.graphql(graphqlOperation(queries.getBuildDefinition, {id: this.state.id}));
      	const buildDefinition = result.data.getBuildDefinition
		} catch (error) {
				console.error(error);
		}
	}

	async componentDidMount()
	{
		await this.reloadData();
	}

	render (){
		return
			<Segment>

			</Segment>
	}
}
