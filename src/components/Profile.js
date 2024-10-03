import { API, Auth, graphqlOperation, Storage } from 'aws-amplify';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Header, Input, Segment, Button, Image, Label, Icon, Message } from "semantic-ui-react";
import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries'
import * as rest from '../util/authenticatedRESTCall'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

const env = process.env["REACT_APP_ENV"];
const restapiurl = process.env["REACT_APP_REST_API_BASEURL"] + env;
const buildArtifactsBucket = process.env["REACT_APP_BUILDARTIFACTS_BUCKET"];

function Profile(){
    const [alias, setAlias] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    
    let navigate = useNavigate();

    async function onChange(e) {
      const file = e.target.files[0];
      const { username, pool } = await Auth.currentAuthenticatedUser();
      const region = pool.userPoolId.split('_')[0];
      try {
        var extension = file.name.split('.').pop();
        var filename = username+"."+extension
        var result = await Storage.put("profile-images/"+filename, file, {
          level: 'public',
//          acl: 'public-read',
//          identityId: identityId,
//          contentType: 'image/png' // contentType is optional
        });
        console.log(result);
        // set public acl
        const url = restapiurl + "/profileimage/" + filename;
        console.log(url);
        result = await rest.authenticatedRESTCall(url, "{'acl':'public'}", "PUT");
        console.log(result);

        var imageUrl = 'https://'+buildArtifactsBucket+".s3."+region+'.amazonaws.com/public/profile-images/'+filename;
        console.log(imageUrl);
        setProfileImageUrl(imageUrl);
        toast({
            title:"Success!",
            description:"Profile image successfully uploaded!. Don't forget to save your changes!"
        })
    } catch (error) {
        console.log('Error uploading file: ', error);
      }  
    }

    function onRemoveProfileImage()
    {
        setProfileImageUrl('');
    }

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
        toast({
            title:'Success!',
            description:'Profile changes successfully saved!'
        });
    }

    async function reloadData()
    {
        console.log("reloading data...")
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
    }, []);

    return <>
        <SemanticToastContainer/>
        <Segment>
            <Message
            warning
            icon='exclamation'
            header='The Crosslink Firmware Factory is DEPRECATED and will SHUTDOWN on December 31, 2024, 23:59 CEST.'
            content='Please download all your configurations and firmware builds to back up your data. We will not keep any data beyond December 31st, 2024 and there will be no way to restore it afterwards.'
            />
            <Header>Edit your profile</Header>
            {
            profileImageUrl !=='' ? <>
            <Button circular animated='fade' onMouseDown={e => e.preventDefault()} onClick={onRemoveProfileImage}>
                <Button.Content hidden>
                    <Icon name='delete'/>
                    Delete Image
                </Button.Content>
                <Button.Content visible>
                    <Image src={profileImageUrl && profileImageUrl !== '' ? profileImageUrl : 'images/image_placeholder.png'} size='tiny' circular/>
                </Button.Content>
            </Button>
            </>
            : 
            <Image src={'images/image_placeholder.png'} size='tiny' circular/>
            }
    <br/>
            <input
                type="file"
                onChange={onChange}
                accept="image/png, image/jpeg"
            />
            <br/>
            <Label content={alias}/>
        </Segment>
        <Segment>
            <Form>
                <Input 
                    type="text"
                    label="Change alias" 
                    placeholder="Enter your favourite alias here"
                    name="alias"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                />
                <br/><br/>
{/*                 <Input 
                    type="text"
                    label="Profile Image Url" 
                    placeholder="Enter a web-accessible URL for a profile image"
                    name="profileImageUrl"
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                />
                <br/> */}
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