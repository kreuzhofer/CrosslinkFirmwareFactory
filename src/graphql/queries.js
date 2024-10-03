/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBuildDefinition = /* GraphQL */ `
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const buildDefinitionsByOwner = /* GraphQL */ `
  query BuildDefinitionsByOwner(
    $owner: String
    $sortDirection: ModelSortDirection
    $filter: ModelBuildDefinitionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    buildDefinitionsByOwner(
      owner: $owner
      sortDirection: $sortDirection
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
        notes
        configurationJSON
        owner
        groupsCanAccess
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
        flash_bytes_used
        flash_bytes_max
        flash_percent_used
        message
        log
        firmwareVersionId
        owner
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBuildJobArtifact = /* GraphQL */ `
  query GetBuildJobArtifact($id: ID!) {
    getBuildJobArtifact(id: $id) {
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
        artifactFileName
        owner
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
      parseJobState
      defaultConfigJson
      createdAt
      updatedAt
      __typename
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
        parseJobState
        defaultConfigJson
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMembershipException = /* GraphQL */ `
  query GetMembershipException($id: ID!) {
    getMembershipException(id: $id) {
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
export const listMembershipExceptions = /* GraphQL */ `
  query ListMembershipExceptions(
    $filter: ModelMembershipExceptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMembershipExceptions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        email
        patronLevel
        roleOverride
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
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
export const listUserProfiles = /* GraphQL */ `
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
