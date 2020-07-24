/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBuildDefinition = /* GraphQL */ `
  query GetBuildDefinition($id: ID!) {
    getBuildDefinition(id: $id) {
      id
      name
      sourceTree
      configTree
      environments {
        items {
          id
          name
          buildDefinitionID
          printerManufacturer
          printerModel
          printerMainboard
          configurationJSON
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
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
        environments {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getBuildConfiguration = /* GraphQL */ `
  query GetBuildConfiguration($id: ID!) {
    getBuildConfiguration(id: $id) {
      id
      name
      buildDefinitionID
      buildDefinition {
        id
        name
        sourceTree
        configTree
        environments {
          nextToken
        }
        createdAt
        updatedAt
      }
      printerManufacturer
      printerModel
      printerMainboard
      configurationJSON
      createdAt
      updatedAt
    }
  }
`;
export const listBuildConfigurations = /* GraphQL */ `
  query ListBuildConfigurations(
    $filter: ModelBuildConfigurationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBuildConfigurations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        buildDefinitionID
        buildDefinition {
          id
          name
          sourceTree
          configTree
          createdAt
          updatedAt
        }
        printerManufacturer
        printerModel
        printerMainboard
        configurationJSON
        createdAt
        updatedAt
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
      }
      nextToken
    }
  }
`;
