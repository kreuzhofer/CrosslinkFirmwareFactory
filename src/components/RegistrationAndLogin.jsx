import React from 'react'
import {
  Grid, Segment, 
} from 'semantic-ui-react'
import {
  AmplifyAuthenticator,
  AmplifySignUp,
} from '@aws-amplify/ui-react'
export class RegistrationAndLogin extends React.Component{
	render(){
		return (
      <Grid padded centered doubling stackable>
        <Grid.Row>
          <Grid.Column>
            <Segment>
              <div className='ui centered medium'>Welcome to the Crosslink firmware factory<br/>
              the place to download and build your custom 3D printer firmware<br/>
              Support this project by <a href="https://www.patreon.com/crosslink" target='_blank' rel="noopener noreferrer">becoming a Patron of Daniel Crosslink!</a><br/>
              User support in our discord channel <a href='https://discord.com/channels/554332400998547486/738041652282916895' target='_blank' rel="noopener noreferrer">#firmware-factory-alpha</a>
            </div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <AmplifyAuthenticator usernameAlias="email" className='custom-auth-container'>
                {/* don't include phone number for signup */}
                <AmplifySignUp
                slot="sign-up"
                formFields={[
                    { type: 'username', label: 'Email Address *', placeholder: 'Ender your email address', required: true },
                    { type: 'password' },
                ]}
                className='custom-auth-container'
                />
            </AmplifyAuthenticator>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Segment>
            <footer>* required field<br/><br/>(C)2021 Daniel Crosslink Media 3D</footer>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
 		);
	}
}