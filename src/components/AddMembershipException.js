import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
    Header, 
    Segment, 
    Button,
    Form,
    Input
  } from 'semantic-ui-react'
import * as mutations from '../graphql/mutations'
import { API, graphqlOperation } from 'aws-amplify'

function AddMembershipException()
{
    const [email, setEmail] = useState('');
    const [patronLevel, setPatronLevel] = useState('0');
    const [roleOverride, setRoleOverride] = useState('');

    let navigate = useNavigate();
    const params = useParams();
    console.log("PARAMS: ", params);

    async function handleSubmit() {
        if(email === '' || patronLevel === '')
        {
            alert("email and patron level have to be filled")
            return false
        }
        let inputData = { 
            email: email,  
            patronLevel: Number(patronLevel),  
            roleOverride: roleOverride 
        };

        let result = await API.graphql(graphqlOperation(mutations.createMembershipException, {input: inputData}));
        console.log(result);
        console.log("ID : "+result.data.createMembershipException.id)
        navigate('/MembershipExceptions');
    }


    return(
        <Segment>
            <Form>
            <Header as='h3'>Add a new membership exception</Header>
            <Input
                type='text'
                label='EMail'
                placeholder='EMail'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}/><br/>
            <Input
                label='Patron level'
                type='text'
                placeholder='Patron level'
                name='patronLevel'
                value={patronLevel}
                onChange={(e) => setPatronLevel(e.target.value)}
            /><br/>
            <Input
                type='text'
                label='Role (optional)'
                placeholder='Role (optional)'
                name='roleOverride'
                value={roleOverride}
                onChange={(e) => setRoleOverride(e.target.value)}
            /><br/><br/>
            <Button
                content='Create'
                onClick={()=> handleSubmit()}
            />
            <Button onClick={()=>navigate('/MembershipExceptions')}>     
                Cancel            
            </Button>
            </Form>
        </Segment>
    )
}

export default AddMembershipException