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
      createdAt
      updatedAt
      owner
      buildJobs {
        items {
          id
          buildDefinitionID
          jobState
          startTime
          endTime
          message
          log
          createdAt
          updatedAt
          owner
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
        createdAt
        updatedAt
        owner
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
      createdAt
      updatedAt
      owner
      buildJobArtifacts {
        items {
          id
          buildJobID
          artifactName
          artifactUrl
          createdAt
          updatedAt
          owner
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
        createdAt
        updatedAt
        owner
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
      createdAt
      updatedAt
      owner
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
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getPatron = /* GraphQL */ `
  query GetPatron($id: ID!) {
    getPatron(id: $id) {
      id
      email
      name
      pledge
      patron_status
      will_pay_amount_cents
      last_event
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listPatrons = /* GraphQL */ `
  query ListPatrons(
    $filter: ModelPatronFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatrons(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        name
        pledge
        patron_status
        will_pay_amount_cents
        last_event
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
