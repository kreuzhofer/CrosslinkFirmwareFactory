import React from 'react'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import {Route, NavLink} from 'react-router-dom'
import {
    Header, 
    Segment, 
    Button,
    Table,
    Icon,
    Confirm,
    Search,
    Label
  } from 'semantic-ui-react'
import _ from 'lodash';  

import * as customqueries from '../graphql/customqueries'
import * as mutations from '../graphql/mutations'
import * as subscriptions from '../graphql/subscriptions'
import * as comparator from '../util/comparator';
import { BuildJobsList } from './BuildJobsList'
//import Lambda from 'aws-sdk/clients/lambda';
import mixpanel from 'mixpanel-browser';
mixpanel.init('b797e33ed9db411af6893878c06f6522');

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
const buildAgentJobQueueUrl = process.env["REACT_APP_BUILDAGENTJOBQUEUEURL"]
//console.log(buildAgentJobQueueUrl)

// https://stackoverflow.com/questions/64072288/how-to-add-environment-variables-to-aws-amplify
// https://create-react-app.dev/docs/adding-custom-environment-variables/
const buildJobTableName = process.env["REACT_APP_BUILDJOBTABLENAME"]
const buildDefinitionTableName = process.env["REACT_APP_BUILDDEFINITIONTABLENAME"]
const graphQLApiUrl = process.env["REACT_APP_GRAPHQLAPIURL"]
const buildArtifactsBucket = process.env["REACT_APP_BUILDARTIFACTS_BUCKET"]

export class BuildDefinitionsList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoading: false,      
      buildDefinitions: [],
      definitionDeleteConfirmState: {open: false},
      subs: [],
      results: [],
      oldResults: [],    
      searchValue: ''
    }
  }

  resetComponent = () => {
    this.setState ({
        isLoading: false,
        results: [],
        oldResults: this.state.buildDefinitions,    
        searchValue: ''
    });
}  

  async reloadData() {
    try {
      const user =  await Auth.currentAuthenticatedUser();
      const result = await API.graphql(graphqlOperation(customqueries.listBuildDefinitionsWithJobs, {limit: 999, 
        filter: {
          owner : {
            eq : user.username
          }
        }
      }));
      var items = result.data.listBuildDefinitions.items
      items.forEach(item => {
        if(item.buildJobs.items.length>0 && (item.buildJobs.items.filter(item=>item.jobState!=="DONE" && item.jobState!=="FAILED").length>0))
          item.buildRunning = true;
      });
//        console.info(items);
      this.setState({buildDefinitions: items, oldResults: items});    
    } catch (error) {
      console.error(error);
    }
  };

  async componentDidMount()
  {
    await this.reloadData();
    const user =  await Auth.currentAuthenticatedUser();
    console.log(user);
    const username = user.username;
//        console.log(username);

    try {
      const insertSubscription = await API.graphql(graphqlOperation(subscriptions.onCreateBuildDefinition, {owner: username})).subscribe({
        next: (eventData) => {
          const buildDefinition = eventData.value.data.onCreateBuildDefinition
          this.setState({buildDefinitions: [...this.state.buildDefinitions, buildDefinition]})
        }
      })
      this.state.subs.push(insertSubscription);
    } catch (error) {
      console.error(error)
    }

    try {
      const deleteSubscription = await API.graphql(graphqlOperation(subscriptions.onDeleteBuildDefinition, {owner: username})).subscribe({
        next: (eventData) => {
          this.setState({buildDefinitions: this.state.buildDefinitions.filter(item => item.id !== eventData.value.data.onDeleteBuildDefinition.id)})
          this.resetComponent();
        }
      })
      this.state.subs.push(deleteSubscription);
    } catch (error) {
      console.error(error)
    }

    try {
      const updateBuildJobSubscription = await API.graphql(graphqlOperation(subscriptions.onUpdateBuildJob, {owner: username})).subscribe({
          next: async (eventData) => {
            await this.reloadData();
        }
      })
      this.state.subs.push(updateBuildJobSubscription);
    } catch (error) {
      console.error(error)
    }

    try {
      const deleteBuildJobSubscription = await API.graphql(graphqlOperation(subscriptions.onDeleteBuildJob, {owner: username})).subscribe({
          next: async (eventData) => {
            await this.reloadData();
        }
      })
      this.state.subs.push(deleteBuildJobSubscription);
    } catch (error) {
      console.error(error)
    }
  }

  componentWillUnmount()
  {
    this.state.subs.forEach(function(item, index, array){
      item.unsubscribe();
    })
  }

  async handleDefinitionDeleteConfirm() {
      try {
        const result = await API.graphql(graphqlOperation(mutations.deleteBuildDefinition, {input: {id: this.state.definitionDeleteConfirmState.id}}));
        console.info(result)
      } catch (error) {
        console.error(error);
      }
      this.setState({definitionDeleteConfirmState: { open: false }})
    }
  
  handleDefinitionDeleteCancel() 
  {
    this.setState({definitionDeleteConfirmState: { open: false }});
  }

  renderBuildDefinitionItems() 
  {
    const { searchValue, results, oldResults, isLoading } = this.state
    const dataToShow = (_.isEmpty(results) && !searchValue) || isLoading ? oldResults : results

    // see https://reactjs.org/docs/handling-events.html
    const handleDelete = (event, id) => {
      console.info("clicked delete "+id);
      this.setState({definitionDeleteConfirmState: {open: true, id: id}});
    }

    const handleBuild = async(event, def) => {
      event.preventDefault();
      console.info("clicked build "+def.id);
      mixpanel.track("Click_build");
      let buildDefinitionID = def.id;

      // store build job in database (used to be in the lambda, now here)
      let result = await API.graphql(graphqlOperation(mutations.createBuildJob, {
        input: {
          buildDefinitionID,
          jobState: 'QUEUED',
          firmwareVersionId: def.firmwareVersionId
      }}));
      console.log(result);
      console.log(result.data.createBuildJob.id)

      // send message to lambda function to process next job
      var params = {
        DelaySeconds: 0,
        MessageAttributes: {
          "buildJobId": {
            DataType: "String",
            StringValue: ""+result.data.createBuildJob.id
          },
          "buildJobTableName":{
            DataType:"String",
            StringValue:buildJobTableName
          },
          "buildDefinitionTableName":{
            DataType:"String",
            StringValue:buildDefinitionTableName
          },
          "graphQLApiUrl":{
            DataType:"String",
            StringValue:graphQLApiUrl
          },
          "buildArtifactsBucket":{
            DataType:"String",
            StringValue:buildArtifactsBucket
          }
        },
        MessageBody: "Build queued for buildDefinition "+def.id,
        QueueUrl: buildAgentJobQueueUrl
      };
      
      var credentials = await Auth.currentCredentials()
      console.info(credentials)
      var sqs = new AWS.SQS({apiVersion: '2012-11-05', credentials: Auth.essentialCredentials(credentials)});

      // // test calling a lambda function
      // const lambda = new Lambda({
      //   credentials: Auth.essentialCredentials(credentials)
      // });
      // var lambdaResult = lambda.invoke({
      //   FunctionName: 'AddBuildDefinitionFromWebHook-prod',
      //   Payload: JSON.stringify({ "hello": "world" })
      // }, (err, data) => {
      //   console.info(err)
      //   console.info(data)
      // });
      // console.info(lambdaResult);

      sqs.sendMessage(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.MessageId);
        }
      });
      await this.reloadData();
      console.log(this.state.buildDefinitions);
    }

    return dataToShow
      .sort((a,b)=>{
        return comparator.makeComparator('printerManufacturer')(a,b)+comparator.makeComparator('printerModel')(a,b)+comparator.makeComparator('printerMainboard')(a,b)
      })
      .map(def => 
      <Table.Row key={def.id}>
        <Table.Cell>{def.printerManufacturer}</Table.Cell>
        <Table.Cell>{def.printerModel}</Table.Cell>
        <Table.Cell>{def.printerMainboard}</Table.Cell>
        <Table.Cell>{def.firmwareVersion ? def.firmwareVersion.name : "custom"}</Table.Cell>
        <Table.Cell><NavLink to={`/BuildDefinition/${def.id}`}>{def.name}</NavLink><br/><br/>{def.description}</Table.Cell>
        <Table.Cell>
        <Route render={({history}) => (
          <Button animated='vertical' onClick={()=>history.push('/AddBuildDefinition/'+def.id)}>
            <Button.Content hidden>Clone</Button.Content>
            <Button.Content visible><Icon name='clone'/></Button.Content>
          </Button>            
        )}>
        </Route>

        <Button loading={def.buildRunning} disabled={def.buildRunning} animated='vertical' onClick={(e)=>handleBuild(e, def)}>
            <Button.Content hidden>Build</Button.Content>
            <Button.Content visible><Icon name='cubes'/></Button.Content>
        </Button>
        <Button disabled={def.buildRunning || def.buildJobs.items.length>0} animated='vertical' onClick={(e)=>handleDelete(e, def.id)} color='red'>
          <Button.Content hidden>Delete</Button.Content>
          <Button.Content visible><Icon name='delete'/></Button.Content>
        </Button>
        </Table.Cell>
        <Table.Cell>
          <BuildJobsList buildDefinition={def} />
        </Table.Cell>
      </Table.Row>)
  }

  handleSearchChange(e, { value }) {
    setTimeout(() => {
    this.setState({ isLoading: true, searchValue: value })

    if (this.state.searchValue.length < 1) return this.resetComponent()
            
    var terms = this.state.searchValue.split(' ');
    var escapedTerms = [];
    terms.forEach(element => {
        if(element !== '')
            escapedTerms.push('(?=.*'+_.escapeRegExp(element)+')');
    });
    var regExpString = escapedTerms.join('');
    const re = new RegExp(regExpString, 'i');
    const filteredResults = _.filter(this.state.buildDefinitions, result => 
        re.test(result.printerManufacturer+' '+
        result.printerModel+ ' '+
        result.printerMainboard + ' '+
        result.name)
        )
        this.setState({
            isLoading: false,
            results: filteredResults,
            oldResults: filteredResults
        })
    }, 30);
  };  

  render()
  {
/*     async function onChange(e) {
      const file = e.target.files[0];
//      const { identityId } = await Auth.currentAuthenticatedUser();
      try {
        await Storage.put(file.name, file, {
          level: 'private',
//          identityId: identityId,
//          contentType: 'image/png' // contentType is optional
        });
      } catch (error) {
        console.log('Error uploading file: ', error);
      }  
    } */

    const boundHandleSearchChange = this.handleSearchChange.bind(this);
    const boundHandleDefinitionDeleteCancel = this.handleDefinitionDeleteCancel.bind(this);
    const boundHandleDefinitionDeleteConfirm = this.handleDefinitionDeleteConfirm.bind(this);
    const { searchValue, isLoading, definitionDeleteConfirmState } = this.state    
  
    return (
      <Segment>
        <Header as='h3'>My Build Definitions</Header>
        <Label>Search</Label>
        <Search
          open={false}
          loading={isLoading}
          onSearchChange={_.debounce(boundHandleSearchChange, 500, { leading: true})}
          value={searchValue}
          />
        <br/>
        <Route render={({history}) => (
            <Button icon='add' onClick={()=>history.push('/AddBuildDefinition')}>                 
            </Button>
          )}>
        </Route>

        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Manufacturer</Table.HeaderCell>
              <Table.HeaderCell>Model</Table.HeaderCell>
              <Table.HeaderCell>Mainboard</Table.HeaderCell>
              <Table.HeaderCell>Firmware</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
              <Table.HeaderCell>Build Jobs</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.renderBuildDefinitionItems()}
          </Table.Body>
        </Table>
        <Confirm
            open={definitionDeleteConfirmState.open}
            cancelButton='Never mind'
            confirmButton="Yes"
            onCancel={boundHandleDefinitionDeleteCancel}
            onConfirm={boundHandleDefinitionDeleteConfirm}
          />

{/*       <input
        type="file"
        onChange={onChange}
      />
 */}      
			</Segment>
    );
  }
}

