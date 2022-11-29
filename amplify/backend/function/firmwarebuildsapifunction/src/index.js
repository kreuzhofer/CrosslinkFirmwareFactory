/* Amplify Params - DO NOT EDIT
	API_MARLINBUILDOPSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_MARLINBUILDOPSAPI_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

console.info(process.env);
const graphQLApiUrl = process.env.API_MARLINBUILDOPSAPI_GRAPHQLAPIENDPOINTOUTPUT;
const apiKey = process.env.API_MARLINBUILDOPSAPI_GRAPHQLAPIKEYOUTPUT;
const region = process.env.REGION;

const AWS = require('aws-sdk');
AWS.config.update({region: region});
const graphql = require('graphql');
const gql = require('graphql-tag');
const { print } = graphql;
const https = require('https');
const urlParse = require("url").URL;
const endpoint = new urlParse(graphQLApiUrl).hostname.toString();

const listBuildDefinitions = /* GraphQL */ gql`
  query ListBuildDefinitions(
    $filter: ModelBuildDefinitionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBuildDefinitions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
              nextToken
            }          
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

const getBuildDefinitionWithBuildJobs = /* GraphQL */ gql`
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
    }
  }
`;

async function rungqlquery(gqlquery, vars)
{
    const req = new AWS.HttpRequest(graphQLApiUrl, region);

    req.method = "POST";
    req.path = "/graphql";
    req.headers.host = endpoint;
    req.headers["Content-Type"] = "application/json";
    req.body = JSON.stringify({
        query: print(gqlquery),
        variables: vars
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

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  let returnValue = null;
  if(event.resource == "/firmwarebuilds")
  {
    var result = await rungqlquery(listBuildDefinitions);
    result = JSON.parse(result.toString());

    var data = result.data.listBuildDefinitions;
    var nextToken = data.nextToken;
    var items = data.items;
    while(nextToken) {
      var nextResult = await rungqlquery(listBuildDefinitions, {nextToken: nextToken});
      nextResult = JSON.parse(nextResult.toString());
      var nextData = nextResult.data.listBuildDefinitions;
      nextToken = nextData.nextToken;
      items = items.concat(nextData.items);
    }
    console.log(`Items: ${JSON.stringify(items)}`);
    returnValue = items.filter(i=>i.groupsCanAccess.includes("Everyone"));
  }
  else if(event.resource == "/firmwarebuilds/{proxy+}")
  {
    let id = event.path.split("/")[2];
    console.log("id: ", id);
    let vars = {
      id: id
    }
    var result = await rungqlquery(getBuildDefinitionWithBuildJobs, vars);
    result = JSON.parse(result.toString());

    returnValue = result.data.getBuildDefinition;
  }
  return {
      statusCode: 200,
  //  Uncomment below to enable CORS requests
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET"
    }, 
      body: JSON.stringify(returnValue),
  };
};
