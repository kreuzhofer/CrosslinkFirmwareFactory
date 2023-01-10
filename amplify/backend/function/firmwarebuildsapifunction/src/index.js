/* Amplify Params - DO NOT EDIT
	API_MARLINBUILDOPSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_MARLINBUILDOPSAPI_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

//console.info(process.env);
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
        firmwareVersion {
          id
          name
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

const listUserProfiles = /* GraphQL */ gql`
  query ListUserProfiles(
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        buildCredits
        profileImageUrl
        alias
        markedForDisabling
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

async function runGqlQuery(gqlQuery, vars)
{
    const req = new AWS.HttpRequest(graphQLApiUrl, region);

    req.method = "POST";
    req.path = "/graphql";
    req.headers.host = endpoint;
    req.headers["Content-Type"] = "application/json";
    req.body = JSON.stringify({
        query: print(gqlQuery),
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
    return JSON.parse(data);
}

function firstLower(string){
  return string.replace(/(?:^|\s)\S/g, function(a){
  return a.toLowerCase(); });
};

async function runListQuery(gqlQuery, vars)
{
  //console.log(JSON.stringify(gqlQuery));

  var queryName = firstLower(gqlQuery.definitions.find(item => item.kind == "OperationDefinition").name.value);
  //console.log(queryName);
  const queryResult = await runGqlQuery(gqlQuery, vars);
  console.log("query result: ",queryResult);

  const data = queryResult.data;
  //console.log("result.data: ",data);

  const queryData = data[queryName];
  //console.log("data[queryName]: ",queryData);

  var nextToken = queryData.nextToken ? queryData.nextToken : null;
  var items = queryData.items ? queryData.items : [];
  //console.log(items);

  while(nextToken) {
    var nextResult = await runGqlQuery(gqlQuery, {nextToken: nextToken});
    var nextData = nextResult.data[queryName];
    nextToken = nextData.nextToken;
    items = items.concat(nextData.items);
  }
  return items;
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  let returnValue = null;
  if(event.resource == "/firmwarebuilds")
  {
    var profiles = await runListQuery(listUserProfiles);
    var items = await runListQuery(listBuildDefinitions);
    //console.log(`Items: ${JSON.stringify(items)}`);
    returnValue = items.filter(i=>i.groupsCanAccess.includes("Everyone"));
    for(const v of returnValue){
      var profile = profiles.find(p=>p.owner == v.owner);
      if(profile)
      {
        v.ownerAlias = profile.alias && profile.alias !== '' ? profile.alias : profile.owner;
        v.ownerImageUrl = profile.profileImageUrl && profile.profileImageUrl !== '' ? profile.profileImageUrl : '/images/image_placeholder.png';
      }
    }
    //console.log(`Items: ${JSON.stringify(returnValue)}`);
  }
  else if(event.resource == "/firmwarebuilds/{proxy+}")
  {
    let id = event.path.split("/")[2];
    console.log("id: ", id);
    let vars = {
      id: id
    }
    var result = await runGqlQuery(getBuildDefinitionWithBuildJobs, vars);
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
