/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAccounts = /* GraphQL */ `mutation CreateAccounts(
  $condition: ModelAccountsConditionInput
  $input: CreateAccountsInput!
) {
  createAccounts(condition: $condition, input: $input) {
    birthdate
    createdAt
    id
    min_withdrawal_date
    name
    starting_balance
    type
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAccountsMutationVariables,
  APITypes.CreateAccountsMutation
>;
export const createHoldings = /* GraphQL */ `mutation CreateHoldings(
  $condition: ModelHoldingsConditionInput
  $input: CreateHoldingsInput!
) {
  createHoldings(condition: $condition, input: $input) {
    account_id
    amount_at_maturity
    amount_paid
    createdAt
    id
    maturity_date
    name
    purchase_date
    rate
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateHoldingsMutationVariables,
  APITypes.CreateHoldingsMutation
>;
export const createTransactions = /* GraphQL */ `mutation CreateTransactions(
  $condition: ModelTransactionsConditionInput
  $input: CreateTransactionsInput!
) {
  createTransactions(condition: $condition, input: $input) {
    account_id
    amount
    createdAt
    holding_id
    id
    type
    updatedAt
    xtn_date
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTransactionsMutationVariables,
  APITypes.CreateTransactionsMutation
>;
export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: CreateUserProfileInput!
) {
  createUserProfile(condition: $condition, input: $input) {
    createdAt
    email
    id
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserProfileMutationVariables,
  APITypes.CreateUserProfileMutation
>;
export const deleteAccounts = /* GraphQL */ `mutation DeleteAccounts(
  $condition: ModelAccountsConditionInput
  $input: DeleteAccountsInput!
) {
  deleteAccounts(condition: $condition, input: $input) {
    birthdate
    createdAt
    id
    min_withdrawal_date
    name
    starting_balance
    type
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAccountsMutationVariables,
  APITypes.DeleteAccountsMutation
>;
export const deleteHoldings = /* GraphQL */ `mutation DeleteHoldings(
  $condition: ModelHoldingsConditionInput
  $input: DeleteHoldingsInput!
) {
  deleteHoldings(condition: $condition, input: $input) {
    account_id
    amount_at_maturity
    amount_paid
    createdAt
    id
    maturity_date
    name
    purchase_date
    rate
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteHoldingsMutationVariables,
  APITypes.DeleteHoldingsMutation
>;
export const deleteTransactions = /* GraphQL */ `mutation DeleteTransactions(
  $condition: ModelTransactionsConditionInput
  $input: DeleteTransactionsInput!
) {
  deleteTransactions(condition: $condition, input: $input) {
    account_id
    amount
    createdAt
    holding_id
    id
    type
    updatedAt
    xtn_date
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTransactionsMutationVariables,
  APITypes.DeleteTransactionsMutation
>;
export const deleteUserProfile = /* GraphQL */ `mutation DeleteUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: DeleteUserProfileInput!
) {
  deleteUserProfile(condition: $condition, input: $input) {
    createdAt
    email
    id
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserProfileMutationVariables,
  APITypes.DeleteUserProfileMutation
>;
export const updateAccounts = /* GraphQL */ `mutation UpdateAccounts(
  $condition: ModelAccountsConditionInput
  $input: UpdateAccountsInput!
) {
  updateAccounts(condition: $condition, input: $input) {
    birthdate
    createdAt
    id
    min_withdrawal_date
    name
    starting_balance
    type
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAccountsMutationVariables,
  APITypes.UpdateAccountsMutation
>;
export const updateHoldings = /* GraphQL */ `mutation UpdateHoldings(
  $condition: ModelHoldingsConditionInput
  $input: UpdateHoldingsInput!
) {
  updateHoldings(condition: $condition, input: $input) {
    account_id
    amount_at_maturity
    amount_paid
    createdAt
    id
    maturity_date
    name
    purchase_date
    rate
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateHoldingsMutationVariables,
  APITypes.UpdateHoldingsMutation
>;
export const updateTransactions = /* GraphQL */ `mutation UpdateTransactions(
  $condition: ModelTransactionsConditionInput
  $input: UpdateTransactionsInput!
) {
  updateTransactions(condition: $condition, input: $input) {
    account_id
    amount
    createdAt
    holding_id
    id
    type
    updatedAt
    xtn_date
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTransactionsMutationVariables,
  APITypes.UpdateTransactionsMutation
>;
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: UpdateUserProfileInput!
) {
  updateUserProfile(condition: $condition, input: $input) {
    createdAt
    email
    id
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserProfileMutationVariables,
  APITypes.UpdateUserProfileMutation
>;
