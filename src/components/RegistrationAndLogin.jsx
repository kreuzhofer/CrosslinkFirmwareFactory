import React from 'react'
import {
  AmplifyAuthenticator,
  AmplifySignUp,
} from '@aws-amplify/ui-react'
export class RegistrationAndLogin extends React.Component{
	render(){
		return (
			<div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
      <table>
          <tbody>
          <tr>
              <td>
                <h1>Welcome to the Crosslink firmware factory</h1>
                <h2>the place to download and build your custom 3D printer firmware</h2>
                <h3>Support this project by becoming a Patron of Daniel Crosslink. <a href="https://www.patreon.com/crosslink" target='_blank' rel="noopener noreferrer">Click here, to become a Patron now!</a></h3>
                <h3>Direct support in our discord channel <a href='https://discord.com/channels/554332400998547486/738041652282916895' target='_blank' rel="noopener noreferrer">#firmware-factory-alpha</a> for Patrons.</h3>
              </td>
          </tr>
          <tr>
            <td>
                <AmplifyAuthenticator usernameAlias="email">
                    {/* don't include phone number for signup */}
                    <AmplifySignUp
                    slot="sign-up"
                    formFields={[
                        { type: 'username', label: 'Email Address *', placeholder: 'Ender your email address', required: true },
                        { type: 'phone_number'},
                        { type: 'password' },
                    ]}
                    />
                </AmplifyAuthenticator>
            </td>
        </tr>
        <tr>
            <td>
                <footer>* required field<br/><br/>(C)2021 Daniel Crosslink Media 3D</footer>
            </td>
        </tr>
        </tbody>
      </table>
    </div>
		);
	}
}