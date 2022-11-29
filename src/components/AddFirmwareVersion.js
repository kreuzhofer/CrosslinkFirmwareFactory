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

function AddFirmwareVersion()
{
    const [name, setName] = useState("");
    const [sourceTree, setSourceTree] = useState("");
    const [configTree, setConfigTree] = useState("");

    let navigate = useNavigate();
    const params = useParams();
    console.log("PARAMS: ", params);

    async function handleSubmit() {
        if(name === '' || sourceTree === '' || configTree === '')
        {
            alert("All fields have to be filled")
            return false
        }
        let inputData = { name: name.trim(),  sourceTree: sourceTree.trim(),  configTree: configTree.trim() };

        let result = await API.graphql(graphqlOperation(mutations.createFirmwareVersion, {input: inputData}
        ));
        console.log(result);
        console.log("ID : "+result.data.createFirmwareVersion.id)
        navigate('/FirmwareVersions');
    }

        return(
            <Segment>
                <Form>
                <Header as='h3'>Add a new firmware version</Header>
                <Input
                    type='text'
                    label='New Firmware Version Name'
                    placeholder='New Firmware Version Name'
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}/><br/>
                <Input
                    label='Source tree URL'
                    type='text'
                    placeholder='Source tree URL'
                    name='sourceTree'
                    value={sourceTree}
                    onChange={(e) => setSourceTree(e.target.value)}
                /><br/>
                <Input
                    type='text'
                    label='Config tree URL'
                    placeholder='Config tree URL'
                    name='configTree'
                    value={configTree}
                    onChange={(e) => setConfigTree(e.target.value)}
                /><br/><br/>
               <Button
                    content='Create'
                    onClick={()=> handleSubmit()}
                />
                <Button onClick={()=>navigate('/FirmwareVersions')}>     
                    Cancel            
                </Button>
                </Form>
            </Segment>
        )
}

export default AddFirmwareVersion;