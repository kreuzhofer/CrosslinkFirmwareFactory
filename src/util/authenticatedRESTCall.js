import { Auth } from 'aws-amplify'
const region = 'eu-west-1';
const https = require('https');
const aws4 = require('aws4');

export async function authenticatedRESTCall(url, data, method) {
    const user = await Auth.currentAuthenticatedUser();
    const token = user.signInUserSession.accessToken.jwtToken;
    console.log(token);
    var credentials = await Auth.currentCredentials();
    console.log(credentials);
    var essentialcredentials = Auth.essentialCredentials(credentials);
    console.log(essentialcredentials);

    var myURL = new URL(url);
    console.log(myURL);

    var options = {
      service: "execute-api",
      region: region,
      host: myURL.host,
      path: myURL.pathname,
      method: method ? method : 'POST',
      body: data
    };

    aws4.sign(options, {
      accessKeyId: essentialcredentials.accessKeyId,
      secretAccessKey: essentialcredentials.secretAccessKey,
      sessionToken: essentialcredentials.sessionToken
    });
    console.log(options);

    return new Promise((resolve, reject) => {
      let req = https.request(options, function (res) {
        let body = ''
        res.on('data', (chunk) => { body += chunk })
        res.on('end', () => { resolve(body) })
      })
      req.write(data)
      req.end()
    })
  }
