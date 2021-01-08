/* Amplify Params - DO NOT EDIT
	API_MARLINBUILDOPSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_MARLINBUILDOPSAPI_GRAPHQLAPIIDOUTPUT
	AUTH_MARLINBUILDOPSFC6385A7_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
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
        const graphqlData = await axios({
          url: process.env.API_MARLINBUILDOPSAPI_GRAPHQLAPIENDPOINTOUTPUT,
          method: 'post',
        //   headers: {
        //     'x-api-key': process.env.API_MARLINBUILDOPSAPI_GRAPHQLAPIKEYOUTPUT
        //   },
          data: {
            query: print(createBuildDefinition),
            variables: {
              input: {
                name: "test", 
                sourceTree: "test", 
                configTree: "test",
                printerManufacturer: "any",
                printerModel: "fancy",
                printerMainboard: "fancier",
                platformioEnv: "fanciest",
                description: "this is it",
                configurationJSON: "{}"
              }
            }
          }
        });
        const body = {
          message: "successfully created build definition!"
        }
        return {
          statusCode: 200,
          body: JSON.stringify(body),
          headers: {
              "Access-Control-Allow-Origin": "*",
          }
        }
      } catch (err) {
        console.log('error creating build definition: ', err);
      } 
};
