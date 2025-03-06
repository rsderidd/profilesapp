/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Accounts = {
  __typename: "Accounts",
  birthdate?: string | null,
  createdAt: string,
  id: string,
  min_withdrawal_date?: string | null,
  name?: string | null,
  owner?: string | null,
  starting_balance?: string | null,
  type?: string | null,
  updatedAt: string,
};

export type Holdings = {
  __typename: "Holdings",
  account_id?: string | null,
  amount_at_maturity?: string | null,
  amount_paid?: string | null,
  createdAt: string,
  id: string,
  maturity_date?: string | null,
  name?: string | null,
  owner?: string | null,
  purchase_date?: string | null,
  rate?: number | null,
  updatedAt: string,
};

export type Transactions = {
  __typename: "Transactions",
  account_id?: string | null,
  amount?: string | null,
  createdAt: string,
  holding_id?: string | null,
  id: string,
  owner?: string | null,
  type?: string | null,
  updatedAt: string,
  xtn_date?: string | null,
};

export type UserProfile = {
  __typename: "UserProfile",
  createdAt: string,
  email?: string | null,
  id: string,
  profileOwner?: string | null,
  updatedAt: string,
};

export type ModelAccountsFilterInput = {
  and?: Array< ModelAccountsFilterInput | null > | null,
  birthdate?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  min_withdrawal_date?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelAccountsFilterInput | null,
  or?: Array< ModelAccountsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  starting_balance?: ModelStringInput | null,
  type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelAccountsConnection = {
  __typename: "ModelAccountsConnection",
  items:  Array<Accounts | null >,
  nextToken?: string | null,
};

export type ModelHoldingsFilterInput = {
  account_id?: ModelStringInput | null,
  amount_at_maturity?: ModelStringInput | null,
  amount_paid?: ModelStringInput | null,
  and?: Array< ModelHoldingsFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  maturity_date?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelHoldingsFilterInput | null,
  or?: Array< ModelHoldingsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  purchase_date?: ModelStringInput | null,
  rate?: ModelFloatInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelHoldingsConnection = {
  __typename: "ModelHoldingsConnection",
  items:  Array<Holdings | null >,
  nextToken?: string | null,
};

export type ModelTransactionsFilterInput = {
  account_id?: ModelStringInput | null,
  amount?: ModelStringInput | null,
  and?: Array< ModelTransactionsFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  holding_id?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelTransactionsFilterInput | null,
  or?: Array< ModelTransactionsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  xtn_date?: ModelStringInput | null,
};

export type ModelTransactionsConnection = {
  __typename: "ModelTransactionsConnection",
  items:  Array<Transactions | null >,
  nextToken?: string | null,
};

export type ModelUserProfileFilterInput = {
  and?: Array< ModelUserProfileFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelUserProfileFilterInput | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  profileOwner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
  nextToken?: string | null,
};

export type ModelAccountsConditionInput = {
  and?: Array< ModelAccountsConditionInput | null > | null,
  birthdate?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  min_withdrawal_date?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelAccountsConditionInput | null,
  or?: Array< ModelAccountsConditionInput | null > | null,
  owner?: ModelStringInput | null,
  starting_balance?: ModelStringInput | null,
  type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateAccountsInput = {
  birthdate?: string | null,
  id?: string | null,
  min_withdrawal_date?: string | null,
  name?: string | null,
  owner?: string | null,
  starting_balance?: string | null,
  type?: string | null,
};

export type ModelHoldingsConditionInput = {
  account_id?: ModelStringInput | null,
  amount_at_maturity?: ModelStringInput | null,
  amount_paid?: ModelStringInput | null,
  and?: Array< ModelHoldingsConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  maturity_date?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelHoldingsConditionInput | null,
  or?: Array< ModelHoldingsConditionInput | null > | null,
  owner?: ModelStringInput | null,
  purchase_date?: ModelStringInput | null,
  rate?: ModelFloatInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateHoldingsInput = {
  account_id?: string | null,
  amount_at_maturity?: string | null,
  amount_paid?: string | null,
  id?: string | null,
  maturity_date?: string | null,
  name?: string | null,
  owner?: string | null,
  purchase_date?: string | null,
  rate?: number | null,
};

export type ModelTransactionsConditionInput = {
  account_id?: ModelStringInput | null,
  amount?: ModelStringInput | null,
  and?: Array< ModelTransactionsConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  holding_id?: ModelStringInput | null,
  not?: ModelTransactionsConditionInput | null,
  or?: Array< ModelTransactionsConditionInput | null > | null,
  owner?: ModelStringInput | null,
  type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  xtn_date?: ModelStringInput | null,
};

export type CreateTransactionsInput = {
  account_id?: string | null,
  amount?: string | null,
  holding_id?: string | null,
  id?: string | null,
  owner?: string | null,
  type?: string | null,
  xtn_date?: string | null,
};

export type ModelUserProfileConditionInput = {
  and?: Array< ModelUserProfileConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  not?: ModelUserProfileConditionInput | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  profileOwner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUserProfileInput = {
  email?: string | null,
  id?: string | null,
  profileOwner?: string | null,
};

export type DeleteAccountsInput = {
  id: string,
};

export type DeleteHoldingsInput = {
  id: string,
};

export type DeleteTransactionsInput = {
  id: string,
};

export type DeleteUserProfileInput = {
  id: string,
};

export type UpdateAccountsInput = {
  birthdate?: string | null,
  id: string,
  min_withdrawal_date?: string | null,
  name?: string | null,
  owner?: string | null,
  starting_balance?: string | null,
  type?: string | null,
};

export type UpdateHoldingsInput = {
  account_id?: string | null,
  amount_at_maturity?: string | null,
  amount_paid?: string | null,
  id: string,
  maturity_date?: string | null,
  name?: string | null,
  owner?: string | null,
  purchase_date?: string | null,
  rate?: number | null,
};

export type UpdateTransactionsInput = {
  account_id?: string | null,
  amount?: string | null,
  holding_id?: string | null,
  id: string,
  owner?: string | null,
  type?: string | null,
  xtn_date?: string | null,
};

export type UpdateUserProfileInput = {
  email?: string | null,
  id: string,
  profileOwner?: string | null,
};

export type ModelSubscriptionAccountsFilterInput = {
  and?: Array< ModelSubscriptionAccountsFilterInput | null > | null,
  birthdate?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  min_withdrawal_date?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionAccountsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  starting_balance?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionHoldingsFilterInput = {
  account_id?: ModelSubscriptionStringInput | null,
  amount_at_maturity?: ModelSubscriptionStringInput | null,
  amount_paid?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionHoldingsFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  maturity_date?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionHoldingsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  purchase_date?: ModelSubscriptionStringInput | null,
  rate?: ModelSubscriptionFloatInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionTransactionsFilterInput = {
  account_id?: ModelSubscriptionStringInput | null,
  amount?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTransactionsFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  holding_id?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionTransactionsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  xtn_date?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionUserProfileFilterInput = {
  and?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  profileOwner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type GetAccountsQueryVariables = {
  id: string,
};

export type GetAccountsQuery = {
  getAccounts?:  {
    __typename: "Accounts",
    birthdate?: string | null,
    createdAt: string,
    id: string,
    min_withdrawal_date?: string | null,
    name?: string | null,
    owner?: string | null,
    starting_balance?: string | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type GetHoldingsQueryVariables = {
  id: string,
};

export type GetHoldingsQuery = {
  getHoldings?:  {
    __typename: "Holdings",
    account_id?: string | null,
    amount_at_maturity?: string | null,
    amount_paid?: string | null,
    createdAt: string,
    id: string,
    maturity_date?: string | null,
    name?: string | null,
    owner?: string | null,
    purchase_date?: string | null,
    rate?: number | null,
    updatedAt: string,
  } | null,
};

export type GetTransactionsQueryVariables = {
  id: string,
};

export type GetTransactionsQuery = {
  getTransactions?:  {
    __typename: "Transactions",
    account_id?: string | null,
    amount?: string | null,
    createdAt: string,
    holding_id?: string | null,
    id: string,
    owner?: string | null,
    type?: string | null,
    updatedAt: string,
    xtn_date?: string | null,
  } | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    profileOwner?: string | null,
    updatedAt: string,
  } | null,
};

export type ListAccountsQueryVariables = {
  filter?: ModelAccountsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAccountsQuery = {
  listAccounts?:  {
    __typename: "ModelAccountsConnection",
    items:  Array< {
      __typename: "Accounts",
      birthdate?: string | null,
      createdAt: string,
      id: string,
      min_withdrawal_date?: string | null,
      name?: string | null,
      owner?: string | null,
      starting_balance?: string | null,
      type?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListHoldingsQueryVariables = {
  filter?: ModelHoldingsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListHoldingsQuery = {
  listHoldings?:  {
    __typename: "ModelHoldingsConnection",
    items:  Array< {
      __typename: "Holdings",
      account_id?: string | null,
      amount_at_maturity?: string | null,
      amount_paid?: string | null,
      createdAt: string,
      id: string,
      maturity_date?: string | null,
      name?: string | null,
      owner?: string | null,
      purchase_date?: string | null,
      rate?: number | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTransactionsQueryVariables = {
  filter?: ModelTransactionsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTransactionsQuery = {
  listTransactions?:  {
    __typename: "ModelTransactionsConnection",
    items:  Array< {
      __typename: "Transactions",
      account_id?: string | null,
      amount?: string | null,
      createdAt: string,
      holding_id?: string | null,
      id: string,
      owner?: string | null,
      type?: string | null,
      updatedAt: string,
      xtn_date?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      createdAt: string,
      email?: string | null,
      id: string,
      profileOwner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateAccountsMutationVariables = {
  condition?: ModelAccountsConditionInput | null,
  input: CreateAccountsInput,
};

export type CreateAccountsMutation = {
  createAccounts?:  {
    __typename: "Accounts",
    birthdate?: string | null,
    createdAt: string,
    id: string,
    min_withdrawal_date?: string | null,
    name?: string | null,
    owner?: string | null,
    starting_balance?: string | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateHoldingsMutationVariables = {
  condition?: ModelHoldingsConditionInput | null,
  input: CreateHoldingsInput,
};

export type CreateHoldingsMutation = {
  createHoldings?:  {
    __typename: "Holdings",
    account_id?: string | null,
    amount_at_maturity?: string | null,
    amount_paid?: string | null,
    createdAt: string,
    id: string,
    maturity_date?: string | null,
    name?: string | null,
    owner?: string | null,
    purchase_date?: string | null,
    rate?: number | null,
    updatedAt: string,
  } | null,
};

export type CreateTransactionsMutationVariables = {
  condition?: ModelTransactionsConditionInput | null,
  input: CreateTransactionsInput,
};

export type CreateTransactionsMutation = {
  createTransactions?:  {
    __typename: "Transactions",
    account_id?: string | null,
    amount?: string | null,
    createdAt: string,
    holding_id?: string | null,
    id: string,
    owner?: string | null,
    type?: string | null,
    updatedAt: string,
    xtn_date?: string | null,
  } | null,
};

export type CreateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: CreateUserProfileInput,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    profileOwner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteAccountsMutationVariables = {
  condition?: ModelAccountsConditionInput | null,
  input: DeleteAccountsInput,
};

export type DeleteAccountsMutation = {
  deleteAccounts?:  {
    __typename: "Accounts",
    birthdate?: string | null,
    createdAt: string,
    id: string,
    min_withdrawal_date?: string | null,
    name?: string | null,
    owner?: string | null,
    starting_balance?: string | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteHoldingsMutationVariables = {
  condition?: ModelHoldingsConditionInput | null,
  input: DeleteHoldingsInput,
};

export type DeleteHoldingsMutation = {
  deleteHoldings?:  {
    __typename: "Holdings",
    account_id?: string | null,
    amount_at_maturity?: string | null,
    amount_paid?: string | null,
    createdAt: string,
    id: string,
    maturity_date?: string | null,
    name?: string | null,
    owner?: string | null,
    purchase_date?: string | null,
    rate?: number | null,
    updatedAt: string,
  } | null,
};

export type DeleteTransactionsMutationVariables = {
  condition?: ModelTransactionsConditionInput | null,
  input: DeleteTransactionsInput,
};

export type DeleteTransactionsMutation = {
  deleteTransactions?:  {
    __typename: "Transactions",
    account_id?: string | null,
    amount?: string | null,
    createdAt: string,
    holding_id?: string | null,
    id: string,
    owner?: string | null,
    type?: string | null,
    updatedAt: string,
    xtn_date?: string | null,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: DeleteUserProfileInput,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    profileOwner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateAccountsMutationVariables = {
  condition?: ModelAccountsConditionInput | null,
  input: UpdateAccountsInput,
};

export type UpdateAccountsMutation = {
  updateAccounts?:  {
    __typename: "Accounts",
    birthdate?: string | null,
    createdAt: string,
    id: string,
    min_withdrawal_date?: string | null,
    name?: string | null,
    owner?: string | null,
    starting_balance?: string | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateHoldingsMutationVariables = {
  condition?: ModelHoldingsConditionInput | null,
  input: UpdateHoldingsInput,
};

export type UpdateHoldingsMutation = {
  updateHoldings?:  {
    __typename: "Holdings",
    account_id?: string | null,
    amount_at_maturity?: string | null,
    amount_paid?: string | null,
    createdAt: string,
    id: string,
    maturity_date?: string | null,
    name?: string | null,
    owner?: string | null,
    purchase_date?: string | null,
    rate?: number | null,
    updatedAt: string,
  } | null,
};

export type UpdateTransactionsMutationVariables = {
  condition?: ModelTransactionsConditionInput | null,
  input: UpdateTransactionsInput,
};

export type UpdateTransactionsMutation = {
  updateTransactions?:  {
    __typename: "Transactions",
    account_id?: string | null,
    amount?: string | null,
    createdAt: string,
    holding_id?: string | null,
    id: string,
    owner?: string | null,
    type?: string | null,
    updatedAt: string,
    xtn_date?: string | null,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: UpdateUserProfileInput,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    profileOwner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateAccountsSubscriptionVariables = {
  filter?: ModelSubscriptionAccountsFilterInput | null,
  owner?: string | null,
};

export type OnCreateAccountsSubscription = {
  onCreateAccounts?:  {
    __typename: "Accounts",
    birthdate?: string | null,
    createdAt: string,
    id: string,
    min_withdrawal_date?: string | null,
    name?: string | null,
    owner?: string | null,
    starting_balance?: string | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateHoldingsSubscriptionVariables = {
  filter?: ModelSubscriptionHoldingsFilterInput | null,
  owner?: string | null,
};

export type OnCreateHoldingsSubscription = {
  onCreateHoldings?:  {
    __typename: "Holdings",
    account_id?: string | null,
    amount_at_maturity?: string | null,
    amount_paid?: string | null,
    createdAt: string,
    id: string,
    maturity_date?: string | null,
    name?: string | null,
    owner?: string | null,
    purchase_date?: string | null,
    rate?: number | null,
    updatedAt: string,
  } | null,
};

export type OnCreateTransactionsSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionsFilterInput | null,
  owner?: string | null,
};

export type OnCreateTransactionsSubscription = {
  onCreateTransactions?:  {
    __typename: "Transactions",
    account_id?: string | null,
    amount?: string | null,
    createdAt: string,
    holding_id?: string | null,
    id: string,
    owner?: string | null,
    type?: string | null,
    updatedAt: string,
    xtn_date?: string | null,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  profileOwner?: string | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    profileOwner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteAccountsSubscriptionVariables = {
  filter?: ModelSubscriptionAccountsFilterInput | null,
  owner?: string | null,
};

export type OnDeleteAccountsSubscription = {
  onDeleteAccounts?:  {
    __typename: "Accounts",
    birthdate?: string | null,
    createdAt: string,
    id: string,
    min_withdrawal_date?: string | null,
    name?: string | null,
    owner?: string | null,
    starting_balance?: string | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteHoldingsSubscriptionVariables = {
  filter?: ModelSubscriptionHoldingsFilterInput | null,
  owner?: string | null,
};

export type OnDeleteHoldingsSubscription = {
  onDeleteHoldings?:  {
    __typename: "Holdings",
    account_id?: string | null,
    amount_at_maturity?: string | null,
    amount_paid?: string | null,
    createdAt: string,
    id: string,
    maturity_date?: string | null,
    name?: string | null,
    owner?: string | null,
    purchase_date?: string | null,
    rate?: number | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteTransactionsSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionsFilterInput | null,
  owner?: string | null,
};

export type OnDeleteTransactionsSubscription = {
  onDeleteTransactions?:  {
    __typename: "Transactions",
    account_id?: string | null,
    amount?: string | null,
    createdAt: string,
    holding_id?: string | null,
    id: string,
    owner?: string | null,
    type?: string | null,
    updatedAt: string,
    xtn_date?: string | null,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  profileOwner?: string | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    profileOwner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateAccountsSubscriptionVariables = {
  filter?: ModelSubscriptionAccountsFilterInput | null,
  owner?: string | null,
};

export type OnUpdateAccountsSubscription = {
  onUpdateAccounts?:  {
    __typename: "Accounts",
    birthdate?: string | null,
    createdAt: string,
    id: string,
    min_withdrawal_date?: string | null,
    name?: string | null,
    owner?: string | null,
    starting_balance?: string | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateHoldingsSubscriptionVariables = {
  filter?: ModelSubscriptionHoldingsFilterInput | null,
  owner?: string | null,
};

export type OnUpdateHoldingsSubscription = {
  onUpdateHoldings?:  {
    __typename: "Holdings",
    account_id?: string | null,
    amount_at_maturity?: string | null,
    amount_paid?: string | null,
    createdAt: string,
    id: string,
    maturity_date?: string | null,
    name?: string | null,
    owner?: string | null,
    purchase_date?: string | null,
    rate?: number | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateTransactionsSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionsFilterInput | null,
  owner?: string | null,
};

export type OnUpdateTransactionsSubscription = {
  onUpdateTransactions?:  {
    __typename: "Transactions",
    account_id?: string | null,
    amount?: string | null,
    createdAt: string,
    holding_id?: string | null,
    id: string,
    owner?: string | null,
    type?: string | null,
    updatedAt: string,
    xtn_date?: string | null,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  profileOwner?: string | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    profileOwner?: string | null,
    updatedAt: string,
  } | null,
};
