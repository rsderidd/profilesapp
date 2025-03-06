/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAccounts = /* GraphQL */ `subscription OnCreateAccounts(
  $filter: ModelSubscriptionAccountsFilterInput
  $owner: String
) {
  onCreateAccounts(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAccountsSubscriptionVariables,
  APITypes.OnCreateAccountsSubscription
>;
export const onCreateHoldings = /* GraphQL */ `subscription OnCreateHoldings(
  $filter: ModelSubscriptionHoldingsFilterInput
  $owner: String
) {
  onCreateHoldings(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateHoldingsSubscriptionVariables,
  APITypes.OnCreateHoldingsSubscription
>;
export const onCreateTransactions = /* GraphQL */ `subscription OnCreateTransactions(
  $filter: ModelSubscriptionTransactionsFilterInput
  $owner: String
) {
  onCreateTransactions(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTransactionsSubscriptionVariables,
  APITypes.OnCreateTransactionsSubscription
>;
export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $profileOwner: String
) {
  onCreateUserProfile(filter: $filter, profileOwner: $profileOwner) {
    createdAt
    email
    id
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onDeleteAccounts = /* GraphQL */ `subscription OnDeleteAccounts(
  $filter: ModelSubscriptionAccountsFilterInput
  $owner: String
) {
  onDeleteAccounts(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAccountsSubscriptionVariables,
  APITypes.OnDeleteAccountsSubscription
>;
export const onDeleteHoldings = /* GraphQL */ `subscription OnDeleteHoldings(
  $filter: ModelSubscriptionHoldingsFilterInput
  $owner: String
) {
  onDeleteHoldings(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteHoldingsSubscriptionVariables,
  APITypes.OnDeleteHoldingsSubscription
>;
export const onDeleteTransactions = /* GraphQL */ `subscription OnDeleteTransactions(
  $filter: ModelSubscriptionTransactionsFilterInput
  $owner: String
) {
  onDeleteTransactions(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTransactionsSubscriptionVariables,
  APITypes.OnDeleteTransactionsSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $profileOwner: String
) {
  onDeleteUserProfile(filter: $filter, profileOwner: $profileOwner) {
    createdAt
    email
    id
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onUpdateAccounts = /* GraphQL */ `subscription OnUpdateAccounts(
  $filter: ModelSubscriptionAccountsFilterInput
  $owner: String
) {
  onUpdateAccounts(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAccountsSubscriptionVariables,
  APITypes.OnUpdateAccountsSubscription
>;
export const onUpdateHoldings = /* GraphQL */ `subscription OnUpdateHoldings(
  $filter: ModelSubscriptionHoldingsFilterInput
  $owner: String
) {
  onUpdateHoldings(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateHoldingsSubscriptionVariables,
  APITypes.OnUpdateHoldingsSubscription
>;
export const onUpdateTransactions = /* GraphQL */ `subscription OnUpdateTransactions(
  $filter: ModelSubscriptionTransactionsFilterInput
  $owner: String
) {
  onUpdateTransactions(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTransactionsSubscriptionVariables,
  APITypes.OnUpdateTransactionsSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $profileOwner: String
) {
  onUpdateUserProfile(filter: $filter, profileOwner: $profileOwner) {
    createdAt
    email
    id
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
