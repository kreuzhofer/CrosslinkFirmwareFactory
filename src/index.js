import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import MyApp from './components/amplify-authentication';
import {Helmet} from "react-helmet";
import 'semantic-ui-css/semantic.min.css'

Amplify.configure(awsExports);

ReactDOM.render(
//  <React.StrictMode>
      <>
      <Helmet>
        <script id="mcjs">{`!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/cab6ca52cf3bc634f70afb049/4a7f11bf418554eac02b1c35f.js");`}</script>      
      </Helmet>
      <Helmet>
        <script>{`
          window.fwSettings={
          'widget_id':80000006868
          };
          !function(){if("function"!=typeof window.FreshworksWidget){var n=function(){n.q.push(arguments)};n.q=[],window.FreshworksWidget=n}}() 
          `}
        </script>
        <script type='text/javascript' src='https://euc-widget.freshworks.com/widgets/80000006868.js' async defer></script>        
      </Helmet>
      <MyApp Component={App}/>
      </>
//  </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
