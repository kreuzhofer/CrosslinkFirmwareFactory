import React from 'react';
import { Route } from "react-router-dom";
import {
    Header, 
    Segment, 
    Button,
    Form,
    Input
  } from 'semantic-ui-react'
import * as mutations from '../graphql/mutations'
import { API, graphqlOperation } from 'aws-amplify'

export class AddMembershipException extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            email: "",
            patronLevel: "0",
            roleOverride: ""
        }
    }

    async handleSubmit() {
        if(this.state.email === '' || this.state.patronLevel === '')
        {
            alert("email and patron level have to be filled")
            return false
        }
        let inputData = { 
            email: this.state.email,  
            patronLevel: Number(this.state.patronLevel),  
            roleOverride: this.state.roleOverride 
        };

        let result = await API.graphql(graphqlOperation(mutations.createMembershipException, {input: inputData}));
        console.log(result);
        console.log("ID : "+result.data.createMembershipException.id)
        this.props.history.push('/MembershipExceptions');
    }

    render() {
        return(
            <Segment>
                <Form>
                <Header as='h3'>Add a new membership exception</Header>
                <Input
                    type='text'
                    label='EMail'
                    placeholder='EMail'
                    name='email'
                    value={this.state.email}
                    onChange={(e) => this.setState({email: e.target.value})}/><br/>
                <Input
                    label='Patron level'
                    type='text'
                    placeholder='Patron level'
                    name='patronLevel'
                    value={this.state.patronLevel}
                    onChange={(e) => this.setState({patronLevel: e.target.value})}
                /><br/>
                <Input
                    type='text'
                    label='Role (optional)'
                    placeholder='Role (optional)'
                    name='roleOverride'
                    value={this.state.roleOverride}
                    onChange={(e) => this.setState({roleOverride: e.target.value})}
                /><br/><br/>
               <Button
                    content='Create'
                    onClick={()=> this.handleSubmit()}
                />
                <Route render={({history}) => (
                    <Button onClick={()=>history.push('/MembershipExceptions')}>     
                        Cancel            
                    </Button>
                )}/>
                </Form>
            </Segment>
        )
    }
}