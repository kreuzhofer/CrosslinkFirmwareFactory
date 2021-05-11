/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBuildDefinition = /* GraphQL */ `
  query GetBuildDefinition($id: ID!) {
    getBuildDefinition(id: $id) {
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
          owner
          groupsCanAccess
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const listBuildDefinitions = /* GraphQL */ `
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
        sourceTree
        configTree
        printerManufacturer
        printerModel
        printerMainboard
        platformioEnv
        description
        configurationJSON
        owner
        groupsCanAccess
        createdAt
        updatedAt
        buildJobs {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getBuildJob = /* GraphQL */ `
  query GetBuildJob($id: ID!) {
    getBuildJob(id: $id) {
      id
      buildDefinitionID
      jobState
      startTime
      endTime
      message
      log
      owner
      groupsCanAccess
      createdAt
      updatedAt
      buildJobArtifacts {
        items {
          id
          buildJobID
          artifactName
          artifactUrl
          owner
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const listBuildJobs = /* GraphQL */ `
  query ListBuildJobs(
    $filter: ModelBuildJobFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBuildJobs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        buildDefinitionID
        jobState
        startTime
        endTime
        message
        log
        owner
        groupsCanAccess
        createdAt
        updatedAt
        buildJobArtifacts {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getBuildJobArtifact = /* GraphQL */ `
  query GetBuildJobArtifact($id: ID!) {
    getBuildJobArtifact(id: $id) {
      id
      buildJobID
      artifactName
      artifactUrl
      owner
      createdAt
      updatedAt
    }
  }
`;
export const listBuildJobArtifacts = /* GraphQL */ `
  query ListBuildJobArtifacts(
    $filter: ModelBuildJobArtifactFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBuildJobArtifacts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        buildJobID
        artifactName
        artifactUrl
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFirmwareVersion = /* GraphQL */ `
  query GetFirmwareVersion($id: ID!) {
    getFirmwareVersion(id: $id) {
      id
      owner
      name
      sourceTree
      configTree
      createdAt
      updatedAt
    }
  }
`;
export const listFirmwareVersions = /* GraphQL */ `
  query ListFirmwareVersions(
    $filter: ModelFirmwareVersionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFirmwareVersions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        name
        sourceTree
        configTree
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
