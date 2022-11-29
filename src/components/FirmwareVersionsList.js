import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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
import Lambda from 'aws-sdk/clients/lambda';
import * as subscriptions from '../graphql/subscriptions'
const env = process.env["REACT_APP_ENV"];
/*if (env.startsWith('dev'))*/ console.log(process.env);
const buildArtifactsBucket = process.env["REACT_APP_BUILDARTIFACTS_BUCKET"];
const firmwareVersionTableName = process.env["REACT_APP_FIRMWAREVERSIONTABLENAME"];

function FirmwareVersionsList() {

    const [firmwareVersions, setFirmwareVersions] = useState([]);
    const [subs] = useState([]);

    let navigate = useNavigate();
    const params = useParams();
    console.log("PARAMS: ", params);
  
    async function reloadData(){
        try {
            const result = await API.graphql(graphqlOperation(listFirmwareVersions));
            console.log(result);
            var data = result.data.listFirmwareVersions;
            var nextToken = data.nextToken;
            var items = data.items;
            while(nextToken) {
              const nextResult = await API.graphql(graphqlOperation(listFirmwareVersions, {nextToken: nextToken}));
              var nextData = nextResult.data.listFirmwareVersions;
              nextToken = nextData.nextToken;
              items = items.concat(nextData.items);
            }
            console.info(items);
            setFirmwareVersions(items);
        } catch (error) {
            console.error(error);
        }
    }

    async function reloadAndSubscribe() {
        await reloadData();

        const user =  await Auth.currentAuthenticatedUser();
        const username = user.username;
 
        try {
            const updateFirmwareVersionSub = await API.graphql(graphqlOperation(subscriptions.onUpdateFirmwareVersion, {owner: username})).subscribe({
                next: async (eventData) => {
                    await reloadData();
                }
            })
            subs.push(updateFirmwareVersionSub);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { 
        reloadAndSubscribe();
        return () => { subs.forEach(s => s.unsubscribe()) } 
    }, [subs]);

    async function handleParse(event, firmwareVersion)
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

    function downloadBlob(blob, filename) {
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
  
    const handleDownload = async(e, job, file) => {
        e.preventDefault();
        const result = await Storage.get(job.id+'/'+file, { download: true });
        //const result = await Storage.get(job.id+'/'+file);
        //console.log(result);
        downloadBlob(result.Body, file);
      }

    function renderFirmwareVersions() {
        return firmwareVersions
        .sort(comparator.makeComparator('name'))
        .map(ver => 
        <Table.Row key={ver.id}>
          <Table.Cell>{ver.name}</Table.Cell>
          <Table.Cell>{ver.sourceTree}</Table.Cell>
          <Table.Cell>{ver.configTree}</Table.Cell>
          <Table.Cell>{ver.parseJobState}</Table.Cell>
          <Table.Cell>Logfile.txt
            <Button animated='vertical' onClick={(e)=>handleDownload(e, ver, "logfile.txt")}>
                <Button.Content hidden>Download</Button.Content>
                <Button.Content visible><Icon name="download"/></Button.Content>
            </Button>
        </Table.Cell>          
          <Table.Cell>
            <Button onClick={(e)=>handleParse(e, ver)}>Parse
            </Button>              
          </Table.Cell>
        </Table.Row>)
    }

        return( 
            <Segment>
                <Header as='h3'>Firmware versions</Header>
                <Button icon='add' onClick={()=>navigate('/AddFirmwareVersion')} />                 
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
                    {renderFirmwareVersions()}
                </Table.Body>
                </Table>
            </Segment>
            )
}

export default FirmwareVersionsList;