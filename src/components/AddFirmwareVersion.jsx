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

export class AddFirmwareVersion extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: "",
            sourceTree: "",
            configTree: ""
        }
    }

    async handleSubmit() {
        if(this.state.name === '' || this.state.sourceTree === '' || this.state.configTree === '')
        {
            alert("All fields have to be filled")
            return false
        }
        let inputData = { name: this.state.name,  sourceTree: this.state.sourceTree,  configTree: this.state.configTree };

        let result = await API.graphql(graphqlOperation(mutations.createFirmwareVersion, {input: inputData}
        ));
        console.log(result);
        console.log("ID : "+result.data.createFirmwareVersion.id)
        this.props.history.push('/FirmwareVersions');
    }

    render() {
        return(
            <Segment>
                <Form>
                <Header as='h3'>Add a new firmware version</Header>
                <Input
                    type='text'
                    label='New Firmware Version Name'
                    placeholder='New Firmware Version Name'
                    name='name'
                    value={this.state.name}
                    onChange={(e) => this.setState({name: e.target.value})}/><br/>
                <Input
                    label='Source tree URL'
                    type='text'
                    placeholder='Source tree URL'
                    name='sourceTree'
                    value={this.state.sourceTree}
                    onChange={(e) => this.setState({sourceTree: e.target.value})}
                /><br/>
                <Input
                    type='text'
                    label='Config tree URL'
                    placeholder='Config tree URL'
                    name='configTree'
                    value={this.state.configTree}
                    onChange={(e) => this.setState({configTree: e.target.value})}
                /><br/><br/>
               <Button
                    content='Create'
                    onClick={()=> this.handleSubmit()}
                />
                <Route render={({history}) => (
                    <Button onClick={()=>history.push('/FirmwareVersions')}>     
                        Cancel            
                    </Button>
                )}/>
                </Form>
            </Segment>
        )
    }
}