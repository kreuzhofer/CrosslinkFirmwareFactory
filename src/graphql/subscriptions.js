/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBuildDefinition = /* GraphQL */ `
  subscription OnCreateBuildDefinition {
    onCreateBuildDefinition {
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
export const onUpdateBuildDefinition = /* GraphQL */ `
  subscription OnUpdateBuildDefinition {
    onUpdateBuildDefinition {
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
export const onDeleteBuildDefinition = /* GraphQL */ `
  subscription OnDeleteBuildDefinition {
    onDeleteBuildDefinition {
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
export const onCreateBuildConfiguration = /* GraphQL */ `
  subscription OnCreateBuildConfiguration {
    onCreateBuildConfiguration {
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
export const onUpdateBuildConfiguration = /* GraphQL */ `
  subscription OnUpdateBuildConfiguration {
    onUpdateBuildConfiguration {
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
export const onDeleteBuildConfiguration = /* GraphQL */ `
  subscription OnDeleteBuildConfiguration {
    onDeleteBuildConfiguration {
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
export const onCreatePatron = /* GraphQL */ `
  subscription OnCreatePatron {
    onCreatePatron {
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
export const onUpdatePatron = /* GraphQL */ `
  subscription OnUpdatePatron {
    onUpdatePatron {
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
export const onDeletePatron = /* GraphQL */ `
  subscription OnDeletePatron {
    onDeletePatron {
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
