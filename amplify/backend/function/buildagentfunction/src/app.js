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
	API_MARLINBUILDOPSAPI_GRAPHQLAPIIDOUTPUT
	API_MARLINBUILDOPSAPI_GRAPHQLAPIENDPOINTOUTPUT
	AMI_ID
	SUBNET_ID
Amplify Params - DO NOT EDIT */

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const AWS = require('aws-sdk');
const region = process.env.REGION;
AWS.config.update({region: region});
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
const graphQLApiUrl = process.env.API_MARLINBUILDOPSAPI_GRAPHQLAPIENDPOINTOUTPUT;
const apiKey = process.env.API_MARLINBUILDOPSAPI_GRAPHQLAPIKEYOUTPUT;
const graphql = require('graphql');
const gql = require('graphql-tag');
const { print } = graphql;
const https = require('https');
const urlParse = require("url").URL;
const endpoint = new urlParse(graphQLApiUrl).hostname.toString();

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

const gqlGetBuildDefinitionWithBuildJobs = /* GraphQL */ gql(`
  query GetBuildDefinition($id: ID!) {
    getBuildDefinition(id: $id) {
      id
      name
      firmwareVersionId
      sourceTree
      configTree
      printerManufacturer
      printerModel
      printerMainboard
      selectedMainboard
      platformioEnv
      description
      configurationJSON
      owner
      groupsCanAccess
      createdAt
      updatedAt
      buildJobs {
        items {
          id
          buildDefinitionID
          jobState
          startTime
          endTime
          message
          log
          firmwareVersionId
          owner
          createdAt
          updatedAt
          buildJobArtifacts {
            items {
              id
              buildJobID
              artifactName
              artifactFileName
              owner
              createdAt
              updatedAt
            }
            nextToken
          }          
        }
        nextToken
      }
      firmwareVersion {
        id
        owner
        name
        sourceTree
        configTree
        parseJobState
        defaultConfigJson
        createdAt
        updatedAt
      }
    }
  }
`);

const gqlUpdateBuildJob = /* GraphQL */ gql(`
  mutation UpdateBuildJob(
    $input: UpdateBuildJobInput!
    $condition: ModelBuildJobConditionInput
  ) {
    updateBuildJob(input: $input, condition: $condition) {
      id
      buildDefinitionID
      jobState
      startTime
      endTime
      message
      log
      firmwareVersionId
      owner
      createdAt
      updatedAt
    }
  }
`);

async function runGqlQuery(gqlQuery, params)
{
    const req = new AWS.HttpRequest(graphQLApiUrl, region);

    req.method = "POST";
    req.path = "/graphql";
    req.headers.host = endpoint;
    req.headers["Content-Type"] = "application/json";
    req.body = JSON.stringify({
        query: print(gqlQuery),
        variables: params
    });

    if (apiKey) {
        req.headers["x-api-key"] = apiKey;
    } else {
        const signer = new AWS.Signers.V4(req, "appsync", true);
        signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    }

    const data = await new Promise((resolve, reject) => {
        const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
          let body = "";
          result.on('data', (data) => {
            body += data;
          });
          result.on('end', () => {
            resolve(body);
          });
          result.on('error', (err) => {
            reject(err);
          });
        });

        httpRequest.write(req.body);
        httpRequest.end();
    });
    return data;
}

async function updateBuildJobState(id, newstate)
{
  console.log("Updating state of job {0} to {1}", id, newstate);
  const params = {
    input: {
        id: id, 
        jobState: newstate
    }
  };
  return await runGqlQuery(gqlUpdateBuildJob, params);
}

async function getBuildJobsForBuildDefinition(buildDefinitionId)
{
  const params = {
    id: buildDefinitionId
  };
  var def = await runGqlQuery(gqlGetBuildDefinitionWithBuildJobs, params);
  def = JSON.parse(def.toString());
  return def.data.getBuildDefinition.buildJobs.items;
}


/**********************
 * Example get method *
 **********************/

app.get('/buildagent', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/buildagent/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/buildagent', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/buildagent/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/buildagent', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/buildagent/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/buildagent', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/buildagent/*', async function(req, res) {
  console.log("request: ", req);
  var buildDefinitionId = req.params['0'];
  console.log("buildDefinitionId: ", buildDefinitionId);
  console.log("Checking instances...");

  var result = await new Promise((resolve, reject) => {
    var params = {
      Filters:[
          {
              'Name': 'tag:Name',
              'Values': [
                  buildDefinitionId,
              ]
          },
          {
              'Name': 'instance-state-name',
              'Values': [
                  'running',
                  'pending'
              ]
          }
      ]
    };
    ec2.describeInstances(params, function(err, data) {
        if(err)
        {
            reject(err);
        }
        else
        {
            resolve(data);
        }
    });
  });

  console.log(result);
  if(result.Reservations.length>0)
  {
      console.log("Already running");
      console.log(result.Reservations[0].Instances);
      var instanceId = result.Reservations[0].Instances[0].InstanceId;
      var terminationResult = await new Promise((resolve, reject) => {
        var params = {
            InstanceIds: [
              instanceId    
            ]
        };
        ec2.terminateInstances(params, function(err, data) {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(data);
            }
        });
      });
      console.log(terminationResult);
  }

  var buildJobs = await getBuildJobsForBuildDefinition(buildDefinitionId);
  console.log(buildJobs);
  buildJobs.forEach(async job => {
    if(job.jobState == "RUNNING" || job.jobState == "STARTING")
      await updateBuildJobState(job.id, "CANCELLED");
  });

  res.json({success: 'cancelling request submitted!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
