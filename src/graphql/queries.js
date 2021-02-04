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
        owner
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
      owner
      email
      full_name
      patron_status
      last_event
      access_expires_at
      campaign_currency
      campaign_lifetime_support_cents
      currently_entitled_amount_cents
      last_charge_date
      last_charge_status
      lifetime_support_cents
      will_pay_amount_cents
      pledge_relationship_start
      createdAt
      updatedAt
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
        owner
        email
        full_name
        patron_status
        last_event
        access_expires_at
        campaign_currency
        campaign_lifetime_support_cents
        currently_entitled_amount_cents
        last_charge_date
        last_charge_status
        lifetime_support_cents
        will_pay_amount_cents
        pledge_relationship_start
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const patronsByEmail = /* GraphQL */ `
  query PatronsByEmail(
    $email: String
    $sortDirection: ModelSortDirection
    $filter: ModelPatronFilterInput
    $limit: Int
    $nextToken: String
  ) {
    patronsByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        email
        full_name
        patron_status
        last_event
        access_expires_at
        campaign_currency
        campaign_lifetime_support_cents
        currently_entitled_amount_cents
        last_charge_date
        last_charge_status
        lifetime_support_cents
        will_pay_amount_cents
        pledge_relationship_start
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPatronActivityLog = /* GraphQL */ `
  query GetPatronActivityLog($id: ID!) {
    getPatronActivityLog(id: $id) {
      id
      patron_event
      event_timestamp
      body
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listPatronActivityLogs = /* GraphQL */ `
  query ListPatronActivityLogs(
    $filter: ModelPatronActivityLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatronActivityLogs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        patron_event
        event_timestamp
        body
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
