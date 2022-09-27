import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import {
    Segment, 
	Label
  } from 'semantic-ui-react'
import * as customqueries from '../graphql/customqueries'

import mixpanel from 'mixpanel-browser';
mixpanel.init('b797e33ed9db411af6893878c06f6522');
	
export class MarlinFirmwareDetails extends React.Component
{
	constructor(props){
		super(props);
		console.log(props);
		this.state = {
			id: props.match.params.id,
			buildDefinition: null
		};
	}

	async reloadData() {
		try {
      	const result = await API.graphql(graphqlOperation(customqueries.getBuildDefinitionWithBuildJobs, {id: this.state.id}));
      	var buildDefinition = result.data.getBuildDefinition;
		console.log(buildDefinition);
		} catch (error) {
				console.error(error);
		}
		this.setState({buildDefinition: buildDefinition});
	}

	async componentDidMount()
	{
		await this.reloadData();
	}

	render () {
		if(this.state.buildDefinition) return (
			<>
			<Segment>
				<Label>Name</Label>
				{this.state.buildDefinition.name}
			</Segment>
			<Segment>
				
			</Segment>
			</>
		)
		else return null;
	}
}
