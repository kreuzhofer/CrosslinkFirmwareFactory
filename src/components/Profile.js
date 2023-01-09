import { API, Auth, graphqlOperation } from 'aws-amplify';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Header, Input, Segment, Button, Image, Label } from "semantic-ui-react";
import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries'

function Profile(){
    const [alias, setAlias] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    
    let navigate = useNavigate();

    async function handleSubmit()
    {
        const user =  await Auth.currentAuthenticatedUser();
        let existingProfile = await API.graphql(graphqlOperation(queries.listUserProfiles, { 
            filter: {
                owner : {
                  eq : user.username
                }
        }}))
        if(existingProfile.data.listUserProfiles.items.length>0)
        {
            let profile = existingProfile.data.listUserProfiles.items[0];
            let inputData = {
                id: profile.id,
                alias: alias.trim(),
                profileImageUrl: profileImageUrl.trim()
            }
            let result = await API.graphql(graphqlOperation(mutations.updateUserProfile, {input: inputData}));
            console.log(result);
        }
        else
        {
            let inputData = { 
                alias: alias.trim(),
                buildCredits: 0,
                profileImageUrl: profileImageUrl.trim()
            };

            let result = await API.graphql(graphqlOperation(mutations.createUserProfile, {input: inputData}));
            console.log(result);
        }
    }

    async function reloadData()
    {
        const user =  await Auth.currentAuthenticatedUser();
        let existingProfile = await API.graphql(graphqlOperation(queries.listUserProfiles, { 
            filter: {
                owner : {
                  eq : user.username
                }
        }}));
        if(existingProfile.data.listUserProfiles.items.length>0)
        {
            let profile = existingProfile.data.listUserProfiles.items[0];
            setAlias(profile.alias);
            setProfileImageUrl(profile.profileImageUrl);
        }
    }

    useEffect(()=>{
        reloadData();
    });

    return <>
        <Segment>
            <Header>Edit your profile</Header>
            <Image src={profileImageUrl} size='small' circular/>
            <Label content={alias}/>
        </Segment>
        <Segment>
            <Form>
                <Input 
                    type="text"
                    label="Alias" 
                    placeholder="Enter your favourite alias here"
                    name="alias"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                />
                <br/>
                <Input 
                    type="text"
                    label="Profile Image Url" 
                    placeholder="Enter a web-accessible URL for a profile image"
                    name="profileImageUrl"
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                />
                <br/>
                <Button onClick={()=> handleSubmit()}>
                    Save
                </Button>
                <Button onClick={()=>navigate(-1)}>
                    Cancel            
                </Button>                                
            </Form>
        </Segment>
    </>
}

export default Profile;