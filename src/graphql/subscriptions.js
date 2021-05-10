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
          owner
          createdAt
          updatedAt
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
          owner
          createdAt
          updatedAt
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
          owner
          createdAt
          updatedAt
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
      owner
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
      owner
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
      owner
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
export const onCreateBuildJobArtifact = /* GraphQL */ `
  subscription OnCreateBuildJobArtifact($owner: String) {
    onCreateBuildJobArtifact(owner: $owner) {
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
export const onUpdateBuildJobArtifact = /* GraphQL */ `
  subscription OnUpdateBuildJobArtifact($owner: String) {
    onUpdateBuildJobArtifact(owner: $owner) {
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
export const onDeleteBuildJobArtifact = /* GraphQL */ `
  subscription OnDeleteBuildJobArtifact($owner: String) {
    onDeleteBuildJobArtifact(owner: $owner) {
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
export const onCreateFirmwareVersion = /* GraphQL */ `
  subscription OnCreateFirmwareVersion($owner: String) {
    onCreateFirmwareVersion(owner: $owner) {
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
export const onUpdateFirmwareVersion = /* GraphQL */ `
  subscription OnUpdateFirmwareVersion($owner: String) {
    onUpdateFirmwareVersion(owner: $owner) {
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
export const onDeleteFirmwareVersion = /* GraphQL */ `
  subscription OnDeleteFirmwareVersion($owner: String) {
    onDeleteFirmwareVersion(owner: $owner) {
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
