import React from 'react';
import { API, graphqlOperation, Auth, Storage } from 'aws-amplify'
import { listFirmwareVersions } from '../graphql/queries';
import {
    Header, 
    Segment, 
    Button,
    Table,
    Icon
  } from 'semantic-ui-react'
import * as comparator from '../util/comparator';
import { Route } from "react-router-dom";
import Lambda from 'aws-sdk/clients/lambda';
import * as subscriptions from '../graphql/subscriptions'
const env = process.env["REACT_APP_ENV"];
const buildArtifactsBucket = process.env["REACT_APP_BUILDARTIFACTS_BUCKET"];
const firmwareVersionTableName = process.env["REACT_APP_FIRMWAREVERSIONTABLENAME"];
console.log(process.env);

export class FirmwareVersionsList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            firmwareVersions: [],
            subs: []
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

        const user =  await Auth.currentAuthenticatedUser();
        const username = user.username;
 
        try {
            const updateFirmwareVersionSub = await API.graphql(graphqlOperation(subscriptions.onUpdateFirmwareVersion, {owner: username})).subscribe({
                next: async (eventData) => {
                    await this.reloadData();
                }
            })
            this.state.subs.push(updateFirmwareVersionSub);
        } catch (error) {
            console.error(error)
        }
    }

    async componentWillUnmount() {
        this.state.subs.forEach(function(item, index, array){
            item.unsubscribe();
          })
    }

    async handleParse(event, firmwareVersion)
    {
        var credentials = await Auth.currentCredentials()
        console.info(credentials)
        // Call lambda function
        const lambda = new Lambda({
          credentials: Auth.essentialCredentials(credentials)
        });
        var lambdaResult = lambda.invoke({
          FunctionName: 'parsemarlinversionfunction-'+env,
          Payload: JSON.stringify({
              "firmwareVersionId": firmwareVersion.id,
              "buildArtifactsBucket": buildArtifactsBucket,
              "firmwareVersionTableName": firmwareVersionTableName
             })
        }, (err, data) => {
          console.info(err)
          console.info(data)
        });
        console.info(lambdaResult);
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        //console.log("Download URL for "+filename+": "+url);
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
  
    handleDownload = async(e, job, file) => {
        e.preventDefault();
        const result = await Storage.get(job.id+'/'+file, { download: true });
        //const result = await Storage.get(job.id+'/'+file);
        //console.log(result);
        this.downloadBlob(result.Body, file);
      }

    firmwareVersions() {
        return this.state.firmwareVersions
        .sort(comparator.makeComparator('name'))
        .map(ver => 
        <Table.Row key={ver.id}>
          <Table.Cell>{ver.name}</Table.Cell>
          <Table.Cell>{ver.sourceTree}</Table.Cell>
          <Table.Cell>{ver.configTree}</Table.Cell>
          <Table.Cell>{ver.parseJobState}</Table.Cell>
          <Table.Cell>Logfile.txt
            <Button animated='vertical' onClick={(e)=>this.handleDownload(e, ver, "logfile.txt")}>
                <Button.Content hidden>Download</Button.Content>
                <Button.Content visible><Icon name="download"/></Button.Content>
            </Button>
        </Table.Cell>          
          <Table.Cell>
            <Button onClick={(e)=>this.handleParse(e, ver)}>Parse
            </Button>              
          </Table.Cell>
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
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Logfile</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
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