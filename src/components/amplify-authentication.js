import React from 'react'
import Amplify from 'aws-amplify'
import {
  AmplifySignOut,
} from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
import config from '../aws-exports'
import { RegistrationAndLogin } from './RegistrationAndLogin'

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
      <Component {...pageProps} />
    </>
  ) : (
    <>
      <RegistrationAndLogin/>
    </>
  )
}

export default MyApp