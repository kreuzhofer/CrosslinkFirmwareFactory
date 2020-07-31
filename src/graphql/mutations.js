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
      configurationJSON
      createdAt
      updatedAt
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
      configurationJSON
      createdAt
      updatedAt
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
      configurationJSON
      createdAt
      updatedAt
    }
  }
`;
export const createPatron = /* GraphQL */ `
  mutation CreatePatron(
    $input: CreatePatronInput!
    $condition: ModelPatronConditionInput
  ) {
    createPatron(input: $input, condition: $condition) {
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
export const updatePatron = /* GraphQL */ `
  mutation UpdatePatron(
    $input: UpdatePatronInput!
    $condition: ModelPatronConditionInput
  ) {
    updatePatron(input: $input, condition: $condition) {
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
export const deletePatron = /* GraphQL */ `
  mutation DeletePatron(
    $input: DeletePatronInput!
    $condition: ModelPatronConditionInput
  ) {
    deletePatron(input: $input, condition: $condition) {
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
