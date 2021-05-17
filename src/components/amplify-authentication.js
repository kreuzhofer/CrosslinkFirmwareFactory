import React from 'react'
import Amplify from 'aws-amplify'
import {
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifySignUp,
} from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
import config from '../aws-exports'

Amplify.configure(config)

const authReducer = (state, action) => {
  switch (action.type) {
    case 'authStateChange':
      return { authStage: action.authStage, user: action.user }
    default:
      throw Error(`action ${action.type} not found.`)
  }
}

const initialState = {}
function MyApp({ Component, pageProps }) {
  const [state, dispatch] = React.useReducer(authReducer, initialState)

  React.useEffect(() => {
    //this will fire anytime a user switches auth scenarios
    // https://docs.amplify.aws/ui/auth/authenticator/q/framework/react#methods--enums
    onAuthUIStateChange((nextAuthState, data) => {
      dispatch({
        type: 'authStateChange',
        authStage: nextAuthState,
        user: data,
      })
    })
  }, [])

  return state.authStage === AuthState.SignedIn && state.user ? (
    <>
      <AmplifySignOut />
      <Component {...pageProps} />
    </>
  ) : (
    <>
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
      <table>
          <tbody>
          <tr>
              <td>
                <h1>Welcome to the Crosslink firmware factory</h1>
                <h2>the place to download and build your custom 3D printer firmware</h2>
                <h3>Access only for Patrons of Daniel Crosslink. <a href="https://www.patreon.com/crosslink" target='_blank'>Click here, to become a Patron now!</a></h3>
                <h3>More support in our discord channel <a href='https://discord.com/channels/554332400998547486/738041652282916895' target='_blank'>#firmware-factory-alpha</a> for Patrons.</h3>
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
    </>
  )
}

export default MyApp