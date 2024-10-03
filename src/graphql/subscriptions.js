/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBuildDefinition = /* GraphQL */ `
  subscription OnCreateBuildDefinition {
    onCreateBuildDefinition {
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
      notes
      configurationJSON
      owner
      groupsCanAccess
      createdAt
      updatedAt
      buildJobs {
        nextToken
        __typename
      }
      firmwareVersion {
        id
        owner
        name
        sourceTree
        configTree
        parseJobState
        defaultConfigJson
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;
export const onUpdateBuildDefinition = /* GraphQL */ `
  subscription OnUpdateBuildDefinition {
    onUpdateBuildDefinition {
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
      notes
      configurationJSON
      owner
      groupsCanAccess
      createdAt
      updatedAt
      buildJobs {
        nextToken
        __typename
      }
      firmwareVersion {
        id
        owner
        name
        sourceTree
        configTree
        parseJobState
        defaultConfigJson
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;
export const onDeleteBuildDefinition = /* GraphQL */ `
  subscription OnDeleteBuildDefinition {
    onDeleteBuildDefinition {
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
      notes
      configurationJSON
      owner
      groupsCanAccess
      createdAt
      updatedAt
      buildJobs {
        nextToken
        __typename
      }
      firmwareVersion {
        id
        owner
        name
        sourceTree
        configTree
        parseJobState
        defaultConfigJson
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;
export const onCreateBuildJob = /* GraphQL */ `
  subscription OnCreateBuildJob {
    onCreateBuildJob {
      id
      buildDefinitionID
      jobState
      startTime
      endTime
      flash_bytes_used
      flash_bytes_max
      flash_percent_used
      message
      log
      firmwareVersionId
      owner
      createdAt
      updatedAt
      buildJobArtifacts {
        nextToken
        __typename
      }
      firmwareVersion {
        id
        owner
        name
        sourceTree
        configTree
        parseJobState
        defaultConfigJson
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;
export const onUpdateBuildJob = /* GraphQL */ `
  subscription OnUpdateBuildJob {
    onUpdateBuildJob {
      id
      buildDefinitionID
      jobState
      startTime
      endTime
      flash_bytes_used
      flash_bytes_max
      flash_percent_used
      message
      log
      firmwareVersionId
      owner
      createdAt
      updatedAt
      buildJobArtifacts {
        nextToken
        __typename
      }
      firmwareVersion {
        id
        owner
        name
        sourceTree
        configTree
        parseJobState
        defaultConfigJson
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;
export const onDeleteBuildJob = /* GraphQL */ `
  subscription OnDeleteBuildJob {
    onDeleteBuildJob {
      id
      buildDefinitionID
      jobState
      startTime
      endTime
      flash_bytes_used
      flash_bytes_max
      flash_percent_used
      message
      log
      firmwareVersionId
      owner
      createdAt
      updatedAt
      buildJobArtifacts {
        nextToken
        __typename
      }
      firmwareVersion {
        id
        owner
        name
        sourceTree
        configTree
        parseJobState
        defaultConfigJson
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;
export const onCreateBuildJobArtifact = /* GraphQL */ `
  subscription OnCreateBuildJobArtifact {
    onCreateBuildJobArtifact {
      id
      buildJobID
      artifactName
      artifactFileName
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateBuildJobArtifact = /* GraphQL */ `
  subscription OnUpdateBuildJobArtifact {
    onUpdateBuildJobArtifact {
      id
      buildJobID
      artifactName
      artifactFileName
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteBuildJobArtifact = /* GraphQL */ `
  subscription OnDeleteBuildJobArtifact {
    onDeleteBuildJobArtifact {
      id
      buildJobID
      artifactName
      artifactFileName
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateFirmwareVersion = /* GraphQL */ `
  subscription OnCreateFirmwareVersion {
    onCreateFirmwareVersion {
      id
      owner
      name
      sourceTree
      configTree
      parseJobState
      defaultConfigJson
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateFirmwareVersion = /* GraphQL */ `
  subscription OnUpdateFirmwareVersion {
    onUpdateFirmwareVersion {
      id
      owner
      name
      sourceTree
      configTree
      parseJobState
      defaultConfigJson
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteFirmwareVersion = /* GraphQL */ `
  subscription OnDeleteFirmwareVersion {
    onDeleteFirmwareVersion {
      id
      owner
      name
      sourceTree
      configTree
      parseJobState
      defaultConfigJson
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMembershipException = /* GraphQL */ `
  subscription OnCreateMembershipException {
    onCreateMembershipException {
      id
      owner
      email
      patronLevel
      roleOverride
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMembershipException = /* GraphQL */ `
  subscription OnUpdateMembershipException {
    onUpdateMembershipException {
      id
      owner
      email
      patronLevel
      roleOverride
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMembershipException = /* GraphQL */ `
  subscription OnDeleteMembershipException {
    onDeleteMembershipException {
      id
      owner
      email
      patronLevel
      roleOverride
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile {
    onCreateUserProfile {
      id
      owner
      buildCredits
      profileImageUrl
      alias
      markedForDisabling
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile {
    onUpdateUserProfile {
      id
      owner
      buildCredits
      profileImageUrl
      alias
      markedForDisabling
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile {
    onDeleteUserProfile {
      id
      owner
      buildCredits
      profileImageUrl
      alias
      markedForDisabling
      createdAt
      updatedAt
      __typename
    }
  }
`;
