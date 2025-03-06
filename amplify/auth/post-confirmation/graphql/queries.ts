/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAccounts = /* GraphQL */ `query GetAccounts($id: ID!) {
  getAccounts(id: $id) {
    birthdate
    createdAt
    id
    min_withdrawal_date
    name
    owner
    starting_balance
    type
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAccountsQueryVariables,
  APITypes.GetAccountsQuery
>;
export const getHoldings = /* GraphQL */ `query GetHoldings($id: ID!) {
  getHoldings(id: $id) {
    account_id
    amount_at_maturity
    amount_paid
    createdAt
    id
    maturity_date
    name
    owner
    purchase_date
    rate
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetHoldingsQueryVariables,
  APITypes.GetHoldingsQuery
>;
export const getTransactions = /* GraphQL */ `query GetTransactions($id: ID!) {
  getTransactions(id: $id) {
    account_id
    amount
    createdAt
    holding_id
    id
    owner
    type
    updatedAt
    xtn_date
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTransactionsQueryVariables,
  APITypes.GetTransactionsQuery
>;
export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
    createdAt
    email
    id
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
>;
export const listAccounts = /* GraphQL */ `query ListAccounts(
  $filter: ModelAccountsFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      birthdate
      createdAt
      id
      min_withdrawal_date
      name
      owner
      starting_balance
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountsQueryVariables,
  APITypes.ListAccountsQuery
>;
export const listHoldings = /* GraphQL */ `query ListHoldings(
  $filter: ModelHoldingsFilterInput
  $limit: Int
  $nextToken: String
) {
  listHoldings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      account_id
      amount_at_maturity
      amount_paid
      createdAt
      id
      maturity_date
      name
      owner
      purchase_date
      rate
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListHoldingsQueryVariables,
  APITypes.ListHoldingsQuery
>;
export const listTransactions = /* GraphQL */ `query ListTransactions(
  $filter: ModelTransactionsFilterInput
  $limit: Int
  $nextToken: String
) {
  listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      account_id
      amount
      createdAt
      holding_id
      id
      owner
      type
      updatedAt
      xtn_date
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTransactionsQueryVariables,
  APITypes.ListTransactionsQuery
>;
export const listUserProfiles = /* GraphQL */ `query ListUserProfiles(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      email
      id
      profileOwner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfilesQueryVariables,
  APITypes.ListUserProfilesQuery
>;
