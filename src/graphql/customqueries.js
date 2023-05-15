// Custom queries
// https://github.com/aws-amplify/amplify-cli/issues/5878
export const listBuildDefinitionsWithJobs = /* GraphQL */ `
  query listBuildDefinitions(
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
        description
        configurationJSON
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
                firmwareVersionId
                firmwareVersion {
                  id
                  owner
                  name
                  sourceTree
                  configTree
                  createdAt
                  updatedAt
                }
            }
           
          nextToken
        }
        firmwareVersion {
            id
            owner
            name
            sourceTree
            configTree
            createdAt
            updatedAt
          }         
        createdAt
        updatedAt
        owner
        groupsCanAccess
      }
      nextToken
    }
  }
`;

export const buildDefinitionsByOwnerWithJobs = /* GraphQL */ `
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
              flash_bytes_used
              flash_bytes_max
              flash_percent_used              
              log
              createdAt
              updatedAt
              owner
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
              firmwareVersionId
              firmwareVersion {
                id
                owner
                name
                sourceTree
                configTree
                createdAt
                updatedAt
              }
          }
        nextToken
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
        }
      }
      nextToken
    }
  }
`;

export const getBuildDefinitionWithBuildJobs = /* GraphQL */ `
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
        items {
          id
          buildDefinitionID
          jobState
          startTime
          endTime
          message
          log
          firmwareVersionId
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
        nextToken
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
      }
    }
  }
`;