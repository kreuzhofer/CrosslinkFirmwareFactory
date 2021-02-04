/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBuildDefinition = /* GraphQL */ `
  subscription OnCreateBuildDefinition($owner: String) {
    onCreateBuildDefinition(owner: $owner) {
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
export const onUpdateBuildDefinition = /* GraphQL */ `
  subscription OnUpdateBuildDefinition($owner: String) {
    onUpdateBuildDefinition(owner: $owner) {
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
export const onDeleteBuildDefinition = /* GraphQL */ `
  subscription OnDeleteBuildDefinition($owner: String) {
    onDeleteBuildDefinition(owner: $owner) {
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
export const onCreateBuildJob = /* GraphQL */ `
  subscription OnCreateBuildJob($owner: String) {
    onCreateBuildJob(owner: $owner) {
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
export const onUpdateBuildJob = /* GraphQL */ `
  subscription OnUpdateBuildJob($owner: String) {
    onUpdateBuildJob(owner: $owner) {
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
export const onDeleteBuildJob = /* GraphQL */ `
  subscription OnDeleteBuildJob($owner: String) {
    onDeleteBuildJob(owner: $owner) {
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
export const onCreateBuildJobArtifact = /* GraphQL */ `
  subscription OnCreateBuildJobArtifact($owner: String) {
    onCreateBuildJobArtifact(owner: $owner) {
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
export const onUpdateBuildJobArtifact = /* GraphQL */ `
  subscription OnUpdateBuildJobArtifact($owner: String) {
    onUpdateBuildJobArtifact(owner: $owner) {
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
export const onDeleteBuildJobArtifact = /* GraphQL */ `
  subscription OnDeleteBuildJobArtifact($owner: String) {
    onDeleteBuildJobArtifact(owner: $owner) {
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
export const onCreatePatron = /* GraphQL */ `
  subscription OnCreatePatron($owner: String) {
    onCreatePatron(owner: $owner) {
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
export const onUpdatePatron = /* GraphQL */ `
  subscription OnUpdatePatron($owner: String) {
    onUpdatePatron(owner: $owner) {
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
export const onDeletePatron = /* GraphQL */ `
  subscription OnDeletePatron($owner: String) {
    onDeletePatron(owner: $owner) {
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
export const onCreatePatronActivityLog = /* GraphQL */ `
  subscription OnCreatePatronActivityLog($owner: String) {
    onCreatePatronActivityLog(owner: $owner) {
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
export const onUpdatePatronActivityLog = /* GraphQL */ `
  subscription OnUpdatePatronActivityLog($owner: String) {
    onUpdatePatronActivityLog(owner: $owner) {
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
export const onDeletePatronActivityLog = /* GraphQL */ `
  subscription OnDeletePatronActivityLog($owner: String) {
    onDeletePatronActivityLog(owner: $owner) {
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
