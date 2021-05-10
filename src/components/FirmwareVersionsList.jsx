import React from 'react';
import { API, graphqlOperation } from 'aws-amplify'
import { listFirmwareVersions } from '../graphql/queries';
import {
    Header, 
    Segment, 
    Button,
    Table
  } from 'semantic-ui-react'
import * as comparator from '../util/comparator';
import { Route } from "react-router-dom";

export class FirmwareVersionsList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            firmwareVersions: []
        }
    }

    async reloadData() {
        try {
            const result = await API.graphql(graphqlOperation(listFirmwareVersions));
            var items = result.data.listFirmwareVersions.items
            console.info(items);
            this.setState({firmwareVersions: items});
        } catch (error) {
            console.error(error);
        }
    }

    async componentDidMount() {
        await this.reloadData();
    }

    firmwareVersions() {
        return this.state.firmwareVersions
        .sort(comparator.makeComparator('name'))
        .map(ver => 
        <Table.Row key={ver.id}>
          <Table.Cell>{ver.name}</Table.Cell>
          <Table.Cell>{ver.sourceTree}</Table.Cell>
          <Table.Cell>{ver.configTree}</Table.Cell>
        </Table.Row>)
    }

    render() {
        return( 
            <Segment>
                <Header as='h3'>Firmware versions</Header>
                <Route render={({history}) => (
                    <Button icon='add' onClick={()=>history.push('/AddFirmwareVersion')}>                 
                    </Button>
                )}>
                </Route>
                <Table celled>
                <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Source tree</Table.HeaderCell>
                    <Table.HeaderCell>Config tree</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {this.firmwareVersions()}
                </Table.Body>
                </Table>
            </Segment>
            )
    }
}