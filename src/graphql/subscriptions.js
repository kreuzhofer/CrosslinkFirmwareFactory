/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBuildDefinition = /* GraphQL */ `
  subscription OnCreateBuildDefinition($owner: String!) {
    onCreateBuildDefinition(owner: $owner) {
      id
      name
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
          status
          startTimestamp
          endTimestamp
          message
          log
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateBuildDefinition = /* GraphQL */ `
  subscription OnUpdateBuildDefinition($owner: String!) {
    onUpdateBuildDefinition(owner: $owner) {
      id
      name
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
          status
          startTimestamp
          endTimestamp
          message
          log
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteBuildDefinition = /* GraphQL */ `
  subscription OnDeleteBuildDefinition($owner: String!) {
    onDeleteBuildDefinition(owner: $owner) {
      id
      name
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
          status
          startTimestamp
          endTimestamp
          message
          log
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateBuildJob = /* GraphQL */ `
  subscription OnCreateBuildJob($owner: String!) {
    onCreateBuildJob(owner: $owner) {
      id
      buildDefinition {
        id
        name
        sourceTree
        configTree
        printerManufacturer
        printerModel
        printerMainboard
        description
        configurationJSON
        buildJobs {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      status
      startTimestamp
      endTimestamp
      message
      log
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateBuildJob = /* GraphQL */ `
  subscription OnUpdateBuildJob($owner: String!) {
    onUpdateBuildJob(owner: $owner) {
      id
      buildDefinition {
        id
        name
        sourceTree
        configTree
        printerManufacturer
        printerModel
        printerMainboard
        description
        configurationJSON
        buildJobs {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      status
      startTimestamp
      endTimestamp
      message
      log
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteBuildJob = /* GraphQL */ `
  subscription OnDeleteBuildJob($owner: String!) {
    onDeleteBuildJob(owner: $owner) {
      id
      buildDefinition {
        id
        name
        sourceTree
        configTree
        printerManufacturer
        printerModel
        printerMainboard
        description
        configurationJSON
        buildJobs {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      status
      startTimestamp
      endTimestamp
      message
      log
      createdAt
      updatedAt
      owner
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
