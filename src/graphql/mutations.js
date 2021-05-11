/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBuildDefinition = /* GraphQL */ `
  mutation CreateBuildDefinition(
    $input: CreateBuildDefinitionInput!
    $condition: ModelBuildDefinitionConditionInput
  ) {
    createBuildDefinition(input: $input, condition: $condition) {
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
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const updateBuildDefinition = /* GraphQL */ `
  mutation UpdateBuildDefinition(
    $input: UpdateBuildDefinitionInput!
    $condition: ModelBuildDefinitionConditionInput
  ) {
    updateBuildDefinition(input: $input, condition: $condition) {
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
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const deleteBuildDefinition = /* GraphQL */ `
  mutation DeleteBuildDefinition(
    $input: DeleteBuildDefinitionInput!
    $condition: ModelBuildDefinitionConditionInput
  ) {
    deleteBuildDefinition(input: $input, condition: $condition) {
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
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const createBuildJob = /* GraphQL */ `
  mutation CreateBuildJob(
    $input: CreateBuildJobInput!
    $condition: ModelBuildJobConditionInput
  ) {
    createBuildJob(input: $input, condition: $condition) {
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
          artifactFileName
          owner
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const updateBuildJob = /* GraphQL */ `
  mutation UpdateBuildJob(
    $input: UpdateBuildJobInput!
    $condition: ModelBuildJobConditionInput
  ) {
    updateBuildJob(input: $input, condition: $condition) {
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
          artifactFileName
          owner
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const deleteBuildJob = /* GraphQL */ `
  mutation DeleteBuildJob(
    $input: DeleteBuildJobInput!
    $condition: ModelBuildJobConditionInput
  ) {
    deleteBuildJob(input: $input, condition: $condition) {
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
          artifactFileName
          owner
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const createBuildJobArtifact = /* GraphQL */ `
  mutation CreateBuildJobArtifact(
    $input: CreateBuildJobArtifactInput!
    $condition: ModelBuildJobArtifactConditionInput
  ) {
    createBuildJobArtifact(input: $input, condition: $condition) {
      id
      buildJobID
      artifactName
      artifactFileName
      owner
      createdAt
      updatedAt
    }
  }
`;
export const updateBuildJobArtifact = /* GraphQL */ `
  mutation UpdateBuildJobArtifact(
    $input: UpdateBuildJobArtifactInput!
    $condition: ModelBuildJobArtifactConditionInput
  ) {
    updateBuildJobArtifact(input: $input, condition: $condition) {
      id
      buildJobID
      artifactName
      artifactFileName
      owner
      createdAt
      updatedAt
    }
  }
`;
export const deleteBuildJobArtifact = /* GraphQL */ `
  mutation DeleteBuildJobArtifact(
    $input: DeleteBuildJobArtifactInput!
    $condition: ModelBuildJobArtifactConditionInput
  ) {
    deleteBuildJobArtifact(input: $input, condition: $condition) {
      id
      buildJobID
      artifactName
      artifactFileName
      owner
      createdAt
      updatedAt
    }
  }
`;
export const createFirmwareVersion = /* GraphQL */ `
  mutation CreateFirmwareVersion(
    $input: CreateFirmwareVersionInput!
    $condition: ModelFirmwareVersionConditionInput
  ) {
    createFirmwareVersion(input: $input, condition: $condition) {
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
export const updateFirmwareVersion = /* GraphQL */ `
  mutation UpdateFirmwareVersion(
    $input: UpdateFirmwareVersionInput!
    $condition: ModelFirmwareVersionConditionInput
  ) {
    updateFirmwareVersion(input: $input, condition: $condition) {
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
export const deleteFirmwareVersion = /* GraphQL */ `
  mutation DeleteFirmwareVersion(
    $input: DeleteFirmwareVersionInput!
    $condition: ModelFirmwareVersionConditionInput
  ) {
    deleteFirmwareVersion(input: $input, condition: $condition) {
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
