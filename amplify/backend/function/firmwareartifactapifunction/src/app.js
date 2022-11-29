/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_USERDATA_BUCKETNAME
Amplify Params - DO NOT EDIT */

const region = process.env.REGION;
const buildArtifactsBucket = process.env.STORAGE_USERDATA_BUCKETNAME;
const AWS = require('aws-sdk');
AWS.config.update({region: region});
var s3 = new AWS.S3();

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  res.header("Access-Control-Allow-Methods", "GET")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/firmwareartifact', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/*
This method will return a signed url to the firmware artifact
https://stackoverflow.com/questions/38831829/nodejs-aws-sdk-s3-generate-presigned-url
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property
*/
app.get('/firmwareartifact/*', function(req, res) {
  // Add your code here

  var urlparts = req.url.split("/");
  if(urlparts.length===4)
  {
    // build the url from parameters
    var params = {Bucket: buildArtifactsBucket, Key: 'public/'+urlparts[2]+"/"+urlparts[3]};
    var url = s3.getSignedUrl('getObject', params);
    console.log('The URL is', url);
    res.json({success: 'get call succeed!', url: url});
  }
  else 
  {
    res.json({success: 'get call succeed!', url: req.url});
  }
});

/****************************
* Example post method *
****************************/

app.post('/firmwareartifact', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/firmwareartifact/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/firmwareartifact', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/firmwareartifact/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/firmwareartifact', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/firmwareartifact/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
