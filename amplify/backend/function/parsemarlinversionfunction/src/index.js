/* Amplify Params - DO NOT EDIT
	API_MARLINBUILDOPSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_MARLINBUILDOPSAPI_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

console.info(process.env);
const amiId = process.env['AmiId'];
const subnetId = process.env['SubnetId'];
const graphQLApiUrl = process.env.API_MARLINBUILDOPSAPI_GRAPHQLAPIENDPOINTOUTPUT;
const apiKey = process.env.API_MARLINBUILDOPSAPI_GRAPHQLAPIKEYOUTPUT;
const region = process.env.REGION;

const AWS = require('aws-sdk');
AWS.config.update({region: region});
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
const fs = require('fs')
const graphql = require('graphql');
const gql = require('graphql-tag');
const { print } = graphql;
const https = require('https');
const urlParse = require("url").URL;
const endpoint = new urlParse(graphQLApiUrl).hostname.toString();

const gqlUpdateFirmwareVersion = /* GraphQL */ gql`
  mutation UpdateFirmwareVersion(
    $input: UpdateFirmwareVersionInput!
    $condition: ModelFirmwareVersionConditionInput
  ) {
    updateFirmwareVersion(input: $input, condition: $condition) {
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
`;

async function updateFirmwareVersion(id, newstate)
{
    console.log("Trying to update state...");
    const req = new AWS.HttpRequest(graphQLApiUrl, region);

    const item = {
        input: {
            id: id, 
            parseJobState: newstate
        }
    };

    req.method = "POST";
    req.path = "/graphql";
    req.headers.host = endpoint;
    req.headers["Content-Type"] = "application/json";
    req.body = JSON.stringify({
        query: print(gqlUpdateFirmwareVersion),
        variables: item
    });

    if (apiKey) {
        req.headers["x-api-key"] = apiKey;
    } else {
        const signer = new AWS.Signers.V4(req, "appsync", true);
        signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    }

    const data = await new Promise((resolve, reject) => {
        const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
            result.on('data', (data) => {
                console.log(data.toString());
                resolve(data);
            });
            result.on('error', (err) => {
                console.log(error.toString());
                reject(err);
            });
        });

        httpRequest.write(req.body);
        httpRequest.end();
    });
    return data;
}

exports.handler = async (event) => {
    console.log(event);
    firmwareVersionId = event['firmwareVersionId'];
    buildArtifactsBucket = event['buildArtifactsBucket'];
    firmwareVersionTableName = event['firmwareVersionTableName'];
    var result = await new Promise((resolve, reject) => {
        var params = {
            Filters: [
                {
                    'Name': 'tag:Name',
                    'Values': [
                        'parsemarlinjob_'+firmwareVersionId,
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
        }
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
        console.error("Already running");
        return {statusCode: 500};
    }

    var userdata = "";
    try {
        userdataText = fs.readFileSync('userdata.sh', 'utf8')
        console.log(userdataText);
        userdata = Buffer.from(userdataText).toString('base64')
    } catch (err) {
        console.error(err)
    }

    var launchResult = await new Promise((resolve, reject)=>{
        var params = {
            ImageId: amiId,
            MinCount: 1,
            MaxCount: 1,
            InstanceType: 't2.micro',
            KeyName: 'crosslink-eu-west-1',
            UserData: userdata,
            SubnetId: subnetId,
            InstanceInitiatedShutdownBehavior: 'terminate',
            IamInstanceProfile: {
                'Name': 'EC2BuildAgentRole'
            },
            TagSpecifications: [
                {
                    'ResourceType': 'instance',
                    'Tags': [
                        {
                            'Key': 'Name',
                            'Value': 'parsemarlinjob_'+firmwareVersionId,
                        },
                        {
                            'Key' : 'FIRMWAREVERSIONID',
                            'Value' : firmwareVersionId
                        },
                        {
                            'Key': 'GRAPHQLAPIURL',
                            'Value': graphQLApiUrl
                        },
                        {
                            'Key': 'BUILDARTIFACTSBUCKET',
                            'Value': buildArtifactsBucket
                        },
                        {
                            'Key': 'FIRMWAREVERSIONTABLENAME',
                            'Value': firmwareVersionTableName
                        }
                    ]
                },
            ]
        }

        // todo launch instance
        ec2.runInstances(params, function(err, data) {
            if (err) {
                // an error occurred
                reject(err);
            } else {
                // successful response
                resolve(data);
            }  
        });
    });
    console.log(launchResult);
    if(launchResult.Instances)
    {
        await updateFirmwareVersion(firmwareVersionId, "STARTING");
        return {
            statusCode: 200,
            body: JSON.stringify('STARTING')};
    }
    else
    {
        await updateFirmwareVersion(firmwareVersionId, "ERROR");
        return {
            statusCode: 500,
            body: JSON.stringify('ERROR')};        
    }


};
