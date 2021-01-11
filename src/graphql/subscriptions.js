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
export const onUpdatePatron = /* GraphQL */ `
  subscription OnUpdatePatron($owner: String) {
    onUpdatePatron(owner: $owner) {
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
export const onDeletePatron = /* GraphQL */ `
  subscription OnDeletePatron($owner: String) {
    onDeletePatron(owner: $owner) {
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
