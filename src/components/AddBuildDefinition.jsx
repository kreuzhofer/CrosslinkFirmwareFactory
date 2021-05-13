import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import {
    Header, 
    Input, 
    Segment, 
    Button,
    Form,
    Label,
  } from 'semantic-ui-react'
import TextareaAutosize from 'react-textarea-autosize';
import {Route} from 'react-router-dom';

import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries'

export class AddBuildDefinition extends React.Component {

    constructor(props){
        super(props);
        console.log(props);
        let id = props.match.params.id ? props.match.params.id : ""
        console.log("id: "+id);
        this.state = {
            name: '',
            sourceTree: '',
            configTree: '',
            printerManufacturer: '',
            printerModel: '',
            printerMainboard: '',
            platformioEnv: '',
            description: '',
            configurationJSON: '{}',
            id: id
        }
    }

    async reloadData(){
        console.log("reloadData");
        try {
          const result = await API.graphql(graphqlOperation(queries.getBuildDefinition, {id: this.state.id}));
          const buildDefinition = result.data.getBuildDefinition
          this.setState({
              name: buildDefinition.name,
              sourceTree: buildDefinition.sourceTree,
              configTree: buildDefinition.configTree,
              printerManufacturer: buildDefinition.printerManufacturer,
              printerModel: buildDefinition.printerModel,
              printerMainboard: buildDefinition.printerMainboard,
              platformioEnv: buildDefinition.platformioEnv,
              description: buildDefinition.description,
              configurationJSON: buildDefinition.configurationJSON
            });
            console.log(this.state)
        } catch (error) {
          console.error(error);
        }
    }

    async componentDidMount()
    {
        if(this.state.id)
            await this.reloadData();
    }

    async handleSubmit(event) {
        event.preventDefault();
        console.log('State: '+this.state)
        if(this.state.name === '' || this.state.sourceTree === '' || this.state.configTree === '')
        {
            alert("All fields have to be filled")
            return false
        }
        let result = await API.graphql(graphqlOperation(mutations.createBuildDefinition, {input: {
            name: this.state.name,
            sourceTree: this.state.sourceTree,
            configTree: this.state.configTree,
            printerManufacturer: this.state.printerManufacturer,
            printerModel: this.state.printerModel,
            printerMainboard: this.state.printerMainboard,
            platformioEnv: this.state.platformioEnv,
            description: this.state.description,
            configurationJSON: this.state.configurationJSON
        }}));
        console.log(result);
        console.log("ID : "+result.data.createBuildDefinition.id)
        this.props.history.push('/BuildDefinition');
    }

    render() {
        return (
            <Segment>
            <Form>
            <Header as='h3'>Add a new build definition</Header>
            <Input
                type='text'
                label='New Build Definition Name'
                placeholder='New Build Definition Name'
                name='name'
                value={this.state.name}
                onChange={(e) => this.setState({name : e.target.value})}/><br/>
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
            /><br/>
            <Input
                type='text'
                label='Printer manufacturer'
                placeholder='Printer manufacturer'
                name='printerManufacturer'
                value={this.state.printerManufacturer}
                onChange={(e) => this.setState({printerManufacturer: e.target.value})}
            /><br/>
            <Input
                type='text'
                label='Printer model'
                placeholder='Printer model'
                name='printerModel'
                value={this.state.printerModel}
                onChange={(e) => this.setState({printerModel: e.target.value})}
            /><br/>
            <Input
                type='text'
                label='Printer mainboard type'
                placeholder='Printer mainboard type'
                name='printerMainboard'
                value={this.state.printerMainboard}
                onChange={(e) => this.setState({printerMainboard: e.target.value})}
            /><br/>
            <Input
                type='text'
                label='Platformio Environment'
                placeholder='Platformio Environment'
                name='platformioEnv'
                value={this.state.platformioEnv}
                onChange={(e) => this.setState({platformioEnv: e.target.value})}
            /><br/>
            <Label>Description</Label>
            <TextareaAutosize
                label='Description'
                placeholder='Description'
                name='description'
                value={this.state.description}
                onChange={(e) => this.setState({description: e.target.value})}
            /><br/>
            <Label>Config JSON</Label>
            <TextareaAutosize
                label='Config JSON'
                placeholder='Config JSON'
                name='configurationJSON'
                value={this.state.configurationJSON}
                onChange={(e) => this.setState({configurationJSON: e.target.value})}
            /><br/>

            <Button
                content='Create'
                onClick={(e)=>this.handleSubmit(e)}
            />
            <Route render={({history}) => (
                <Button onClick={()=>history.push('/BuildDefinition')}>     
                    Cancel            
                </Button>
            )}/>            
            </Form>
            </Segment>
            );
        }
    }