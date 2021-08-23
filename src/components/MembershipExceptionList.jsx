import React from 'react';
import { API, graphqlOperation } from 'aws-amplify'
import { listMembershipExceptions } from '../graphql/queries';
import {
    Header, 
    Segment, 
    Button,
    Table
  } from 'semantic-ui-react'
import * as comparator from '../util/comparator';
import { Route } from "react-router-dom";

export class MembershipExceptionList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            membershipExceptions: []
        }
    }

    async reloadData() {
        try {
            const result = await API.graphql(graphqlOperation(listMembershipExceptions));
            var items = result.data.listMembershipExceptions.items
            console.info(items);
            this.setState({membershipExceptions: items});
        } catch (error) {
            console.error(error);
        }
    }

    async componentDidMount() {
        await this.reloadData();
    }

    membershipExceptions() {
        return this.state.membershipExceptions
        .sort(comparator.makeComparator('email'))
        .map(item => 
        <Table.Row key={item.id}>
          <Table.Cell>{item.email}</Table.Cell>
          <Table.Cell>{item.patronLevel}</Table.Cell>
          <Table.Cell>{item.role}</Table.Cell>
        </Table.Row>)
    }

    render() {
        return( 
            <Segment>
                <Header as='h3'>Membership exceptions</Header>
                <Route render={({history}) => (
                    <Button icon='add' onClick={()=>history.push('/AddMembershipException')}>                 
                    </Button>
                )}>
                </Route>
                <Table celled>
                <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Patron Level</Table.HeaderCell>
                    <Table.HeaderCell>Role (optional)</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {this.membershipExceptions()}
                </Table.Body>
                </Table>
            </Segment>
            )
    }
}