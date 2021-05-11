import React from 'react'
import { listBuildDefinitions } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify'
import {
    Header, 
    Segment, 
    Table
  } from 'semantic-ui-react'
import * as comparator from '../util/comparator';

export class MarlinFirmwareDownloads extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            buildDefinitions: []
        }
    }

    async reloadData() {
        try {
            const result = await API.graphql(graphqlOperation(listBuildDefinitions));
            var items = result.data.listBuildDefinitions.items
            console.info(items);
            this.setState({buildDefinitions: items});
        } catch (error) {
            console.error(error);
        }
    }

    async componentDidMount() {
        await this.reloadData();
    }

    firmwareBuilds() {
        return this.state.buildDefinitions
        .sort(comparator.makeComparator('name'))
        .map(build => 
        <Table.Row key={build.id}>
          <Table.Cell>{build.name}</Table.Cell>
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