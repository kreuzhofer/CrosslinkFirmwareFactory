import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { API, graphqlOperation } from 'aws-amplify'
import { listMembershipExceptions } from '../graphql/queries';
import {
    Header, 
    Segment, 
    Button,
    Table
  } from 'semantic-ui-react'
import * as comparator from '../util/comparator';

function MembershipExceptionList() {

    const [membershipExceptions, setMembershipExceptions] = useState([]);

    let navigate = useNavigate();
    const params = useParams();
    console.log("PARAMS: ", params);

    async function reloadData() {
        try {
            const result = await API.graphql(graphqlOperation(listMembershipExceptions));
            var items = result.data.listMembershipExceptions.items
            console.info(items);
            setMembershipExceptions(items);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        reloadData();
    }, []);

    function renderMembershipExceptions() {
        return membershipExceptions
        .sort(comparator.makeComparator('email'))
        .map(item => 
        <Table.Row key={item.id}>
          <Table.Cell>{item.email}</Table.Cell>
          <Table.Cell>{item.patronLevel}</Table.Cell>
          <Table.Cell>{item.role}</Table.Cell>
        </Table.Row>)
    }

    return( 
        <Segment>
            <Header as='h3'>Membership exceptions</Header>
            <Button icon='add' onClick={()=>navigate('/AddMembershipException')}>                 
            </Button>
            <Table celled>
            <Table.Header>
                <Table.Row>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Patron Level</Table.HeaderCell>
                <Table.HeaderCell>Role (optional)</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {renderMembershipExceptions()}
            </Table.Body>
            </Table>
        </Segment>
        )
}

export default MembershipExceptionList