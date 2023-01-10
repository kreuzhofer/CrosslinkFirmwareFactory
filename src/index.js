import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
//import MyApp from './components/amplify-authentication';
import {Helmet} from "react-helmet";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // default theme

import 'semantic-ui-css/semantic.min.css'
import 'react-semantic-toasts/styles/react-semantic-alert.css';

Amplify.configure(awsExports);

ReactDOM.render(
//  <React.StrictMode>
      <>
      <Helmet>
      </Helmet>
      <Authenticator.Provider>
        <App/>
      </Authenticator.Provider>
      </>
//  </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
