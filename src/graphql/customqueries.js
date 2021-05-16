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