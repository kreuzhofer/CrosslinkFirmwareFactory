import React, { useEffect, useState } from 'react'
import { API, graphqlOperation, Auth, Storage } from 'aws-amplify'
import {Route, NavLink, useParams} from 'react-router-dom'
import {
    Header, 
    Segment, 
    Button,
    Table,
    Icon,
    Confirm,
  } from 'semantic-ui-react'

import * as customqueries from '../graphql/customqueries'
import * as mutations from '../graphql/mutations'
import * as subscriptions from '../graphql/subscriptions'
import * as comparator from '../util/comparator';
//import Lambda from 'aws-sdk/clients/lambda';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
const buildAgentJobQueueUrl = process.env["REACT_APP_BUILDAGENTJOBQUEUEURL"]
console.log(buildAgentJobQueueUrl)

// https://stackoverflow.com/questions/64072288/how-to-add-environment-variables-to-aws-amplify
// https://create-react-app.dev/docs/adding-custom-environment-variables/
const buildJobTableName = process.env["REACT_APP_BUILDJOBTABLENAME"]
const buildDefinitionTableName = process.env["REACT_APP_BUILDDEFINITIONTABLENAME"]
const graphQLApiUrl = process.env["REACT_APP_GRAPHQLAPIURL"]
const buildArtifactsBucket = process.env["REACT_APP_BUILDARTIFACTS_BUCKET"]

const BuildDefinitionsList = () => {
    let { isAdmin } = useParams();
    console.log("IsAdmin in BuildDefinitionsList: "+isAdmin);
    const [buildDefinitions, setBuildDefinitions] = useState([])
    const [definitionDeleteConfirmState, setDefinitionDeleteConfirmState] = useState({ open: false })
    const [jobDeleteConfirmState, setJobDeleteConfirmState] = useState({ open: false })

    const reloadData = async()=>{
      try {
        const result = await API.graphql(graphqlOperation(customqueries.listBuildDefinitionsWithJobs, {limit: 999}));
        var items = result.data.listBuildDefinitions.items
        items.forEach(item => {
          if(item.buildJobs.items.length>0 && (item.buildJobs.items.filter(item=>item.jobState!=="DONE" && item.jobState!=="FAILED").length>0))
            item.buildRunning = true;
        });
        console.info(items);
        setBuildDefinitions(items);
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      const subs = [];
      async function fetchData() {
        await reloadData();
        const user =  await Auth.currentAuthenticatedUser();
        console.log(user);
        const username = user.username;
        console.log(username);

        try {
          const insertSubscription = await API.graphql(graphqlOperation(subscriptions.onCreateBuildDefinition, {owner: username})).subscribe({
            next: (eventData) => {
              const buildDefinition = eventData.value.data.onCreateBuildDefinition
              setBuildDefinitions(buildDefinitions => [...buildDefinitions, buildDefinition])
            }
          })
          subs.push(insertSubscription);
        } catch (error) {
          console.error(error)
        }

        try {
          const deleteSubscription = await API.graphql(graphqlOperation(subscriptions.onDeleteBuildDefinition, {owner: username})).subscribe({
            next: (eventData) => {
              setBuildDefinitions(buildDefinitions => buildDefinitions.filter(item => item.id !== eventData.value.data.onDeleteBuildDefinition.id));
            }
          })
          subs.push(deleteSubscription);
        } catch (error) {
          console.error(error)
        }

        try {
          const updateBuildJobSubscription = await API.graphql(graphqlOperation(subscriptions.onUpdateBuildJob, {owner: username})).subscribe({
              next: async (eventData) => {
                await reloadData();
            }
          })
          subs.push(updateBuildJobSubscription);
        } catch (error) {
          console.error(error)
        }

        try {
          const deleteBuildJobSubscription = await API.graphql(graphqlOperation(subscriptions.onDeleteBuildJob, {owner: username})).subscribe({
              next: async (eventData) => {
                await reloadData();
            }
          })
          subs.push(deleteBuildJobSubscription);
        } catch (error) {
          console.error(error)
        }
      }
      fetchData();

      console.log(process.env)

      return () => {
        subs.forEach(function(item, index, array){
          item.unsubscribe();
        })
      }
    }, [])

    const handleDefinitionDeleteConfirm = async() => {
      try {
        const result = await API.graphql(graphqlOperation(mutations.deleteBuildDefinition, {input: {id: definitionDeleteConfirmState.id}}));
        console.info(result)
      } catch (error) {
        console.error(error);
      }
      setDefinitionDeleteConfirmState({ open: false })
    }
    const handleDefinitionDeleteCancel = () => setDefinitionDeleteConfirmState({ open: false })

    const handleJobDeleteConfirm = async() => {
      try {
        const result = await API.graphql(graphqlOperation(mutations.deleteBuildJob, {input: {id: jobDeleteConfirmState.id}}));
        console.info(result)
      } catch (error) {
        console.error(error);
      }
      setJobDeleteConfirmState({ open: false })
    }
    const handleJobDeleteCancel = () => setJobDeleteConfirmState({ open: false })

    function downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      console.log("Download URL for "+filename+": "+url);
      a.download = filename || 'download';
      const clickHandler = () => {
        setTimeout(() => {
          URL.revokeObjectURL(url);
          a.removeEventListener('click', clickHandler);
        }, 150);
      };
      a.addEventListener('click', clickHandler, false);
      a.click();
      return a;
    }

    const handleDownload = async(e, job, file) => {
      e.preventDefault();
      const result = await Storage.get(job.id+'/'+file, { download: true });
      //const result = await Storage.get(job.id+'/'+file);
      console.log(result);
      downloadBlob(result.Body, file);
    }

    function firmwareArtifacts(artifacts){

      function downloadBlob(blob, filename) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          console.log("Download URL for "+filename+": "+url);
          a.download = filename || 'download';
          const clickHandler = () => {
            setTimeout(() => {
              URL.revokeObjectURL(url);
              a.removeEventListener('click', clickHandler);
            }, 150);
          };
          a.addEventListener('click', clickHandler, false);
          a.click();
          return a;
        }

      const handleDownload = async(e, jobId, file) => {
          e.preventDefault();
          const result = await Storage.get(jobId+'/'+file, { download: true });
          //const result = await Storage.get(job.id+'/'+file);
          console.log(result);
          downloadBlob(result.Body, file);
        }

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
                          <Table.Cell>
                              {a.artifactFileName}
                              <Button animated='vertical' onClick={(e)=>handleDownload(e, a.buildJobID, a.artifactFileName)}>
                                  <Button.Content hidden>Download</Button.Content>
                                  <Button.Content visible><Icon name="download"/></Button.Content>
                              </Button>
                          </Table.Cell>
                      </Table.Row>
                  )}
              </Table.Body>
          </Table>
      )
    }    

    const buildJobsList = (jobs, def) => {
        console.info(jobs)
        if(jobs == null)
            return null;

        const handleJobDelete = (event, id) => {
          console.info("clicked delete "+id);
          setJobDeleteConfirmState({open: true, id: id});
        }

        return jobs.sort(comparator.makeComparator('createdAt', 'desc')).slice(0,3).map(job=>
            <Table.Row key={job.id}>
                <Table.Cell>{job.createdAt}</Table.Cell>
                <Table.Cell>{job.jobState}</Table.Cell>
                <Table.Cell>Logfile.txt
                  <Button disabled={def.buildRunning} animated='vertical' onClick={(e)=>handleDownload(e, job, "logfile.txt")}>
                    <Button.Content hidden>Download</Button.Content>
                    <Button.Content visible><Icon name="download"/></Button.Content>
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  {firmwareArtifacts(job.buildJobArtifacts.items)}
                </Table.Cell>
                <Table.Cell>
                  <Button disabled={def.buildRunning} animated='vertical' onClick={(e)=>handleJobDelete(e, job.id)} color='red'>
                    <Button.Content hidden>Delete</Button.Content>
                    <Button.Content visible><Icon name='delete'/></Button.Content>
                    </Button>
                  </Table.Cell>
            </Table.Row>
        )
    }
  
    const buildDefinitionItems = () => {
  
      // see https://reactjs.org/docs/handling-events.html
      const handleDelete = (event, id) => {
        console.info("clicked delete "+id);
        setDefinitionDeleteConfirmState({open: true, id: id});
      }

      const handleBuild = async(event, def) => {
        event.preventDefault();
        console.info("clicked build "+def.id);
        let buildDefinitionID = def.id;

        // store build job in database (used to be in the lambda, now here)
        let result = await API.graphql(graphqlOperation(mutations.createBuildJob, {
          input: {
            buildDefinitionID,
            jobState: 'QUEUED'
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
        await reloadData();
        console.log(buildDefinitions)
      }
 
      return buildDefinitions
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
          <Button disabled={def.buildRunning} animated='vertical' onClick={(e)=>handleDelete(e, def.id)} color='red'>
            <Button.Content hidden>Delete</Button.Content>
            <Button.Content visible><Icon name='delete'/></Button.Content>
          </Button>
          </Table.Cell>
          <Table.Cell>
              <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Time started</Table.HeaderCell>
                      <Table.HeaderCell>State</Table.HeaderCell>
                      <Table.HeaderCell>Artifacts</Table.HeaderCell>
                      <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                    <Table.Body>
                        {buildJobsList(def.buildJobs.items, def)}
                    </Table.Body>
              </Table>
          </Table.Cell>
        </Table.Row>)
    }

    async function onChange(e) {
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
    }
  
    return (
      <Segment>
        <Header as='h3'>My Build Definitions</Header>
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
            {buildDefinitionItems()}
          </Table.Body>
        </Table>
        <Confirm
            open={definitionDeleteConfirmState.open}
            cancelButton='Never mind'
            confirmButton="Yes"
            onCancel={handleDefinitionDeleteCancel}
            onConfirm={handleDefinitionDeleteConfirm}
          />
        <Confirm
            open={jobDeleteConfirmState.open}
            cancelButton='Never mind'
            confirmButton="Yes"
            onCancel={handleJobDeleteCancel}
            onConfirm={handleJobDeleteConfirm}
          />

      <input
        type="file"
        onChange={onChange}
      />
      </Segment>
    );
  }

export { BuildDefinitionsList }
