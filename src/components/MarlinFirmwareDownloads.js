import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import {
    Header, 
    Segment, 
    Table
  } from 'semantic-ui-react'
import * as comparator from '../util/comparator';
import * as customqueries from '../graphql/customqueries'
//import * as queries from '../graphql/queries'

export class MarlinFirmwareDownloads extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            buildDefinitions: []
        }
    }

    async reloadData() {
        try {
            const result = await API.graphql(graphqlOperation(customqueries.listBuildDefinitionsWithJobs, {limit:999}));
            var items = result.data.listBuildDefinitions.items
            this.setState({buildDefinitions: items});
        } catch (error) {
            console.error(error);
        }
    }

    async componentDidMount() {
        await this.reloadData();
    }

    firmwareArtifacts(jobs){
        if(jobs == null)
            return null;
        let finishedJobs = jobs.sort(comparator.makeComparator('createdAt', 'desc')).filter(j=>j.jobState === 'DONE').slice(0,1);
        console.log(finishedJobs);
        if(finishedJobs){
            let first = finishedJobs[0];
            if(!first)
                return null;
            console.log(first);
            let artifacts = first.buildJobArtifacts.items
            return (
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>File</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {artifacts.map(a=>
                            <Table.Row key={a.id}>
                                <Table.Cell>{a.artifactName}</Table.Cell>
                                <Table.Cell>{a.artifactFileName}</Table.Cell>
                            </Table.Row>)}
                    </Table.Body>
                </Table>
            )
        }
    }

    firmwareBuilds() {
        return this.state.buildDefinitions
        .sort(comparator.makeComparator('name'))
        .map(build => 
        <Table.Row key={build.id}>
          <Table.Cell><h4>{build.name}</h4><br/>{build.description}</Table.Cell>
          <Table.Cell>{this.firmwareArtifacts(build.buildJobs.items)}</Table.Cell>
        </Table.Row>)
    }

    render() {
        return (
            <Segment>
                <Header as='h3'>Firmware builds</Header>
                <Table celled>
                <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Artifacts</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {this.firmwareBuilds()}
                </Table.Body>
                </Table>
            </Segment>
        )
    }
}