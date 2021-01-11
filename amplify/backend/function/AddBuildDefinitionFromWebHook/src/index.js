/* Amplify Params - DO NOT EDIT
	API_MARLINBUILDOPSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_MARLINBUILDOPSAPI_GRAPHQLAPIIDOUTPUT
	AUTH_MARLINBUILDOPSFC6385A7_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const gql = require('graphql-tag');
const graphql = require('graphql');
const AWS = require("aws-sdk");
const https = require('https');
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_MARLINBUILDOPSAPI_GRAPHQLAPIENDPOINTOUTPUT;
const apiKey = process.env.API_MARLINBUILDOPSAPI_GRAPHQLAPIKEYOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const { print } = graphql;

const createBuildDefinition = /* GraphQL */ gql`
  mutation CreateBuildDefinition(
    $input: CreateBuildDefinitionInput!
  ) {
    createBuildDefinition(input: $input) {
      id
      name
      sourceTree
      configTree
      printerManufacturer
      printerModel
      printerMainboard
      platformioEnv
      description
      configurationJSON
      buildJobs {
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;

exports.handler = async (event) => {
    try {
        const req = new AWS.HttpRequest(appsyncUrl, region);

        const item = {
            input: {
                name: "test", 
                sourceTree: "test", 
                configTree: "test",
                printerManufacturer: "any",
                printerModel: "fancy",
                printerMainboard: "fancier",
                platformioEnv: "fanciest",
                description: "this is it",
                configurationJSON: "{}",
                owner: "daniel"
            }
        };
    
        req.method = "POST";
        req.path = "/graphql";
        req.headers.host = endpoint;
        req.headers["Content-Type"] = "application/json";
        req.body = JSON.stringify({
            query: print(createBuildDefinition),
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
                    resolve(JSON.parse(data.toString()));
                });
            });
    
            httpRequest.write(req.body);
            httpRequest.end();
        });
    
        return {
            statusCode: 200,
            body: data
        };

      } catch (err) {
        console.log('error creating build definition: ', err);
      } 
};
