import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    UserProfile: a
      .model({
        email: a.string(),
        profileOwner: a.string()
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),
    Accounts: a
      .model({
        name: a.string(),
        type: a.string(),
        birthdate: a.string(),
        min_withdrawal_date: a.string(),
        starting_balance: a.string(),
        owner: a.string()
      }).authorization((allow) => [allow.ownerDefinedIn("owner"), allow.authenticated()]),
    Holdings: a
      .model({
        account_id: a.string(),
        name: a.string(),
        purchase_date: a.string(),
        amount_paid: a.string(),
        maturity_date: a.string(),
        rate: a.float(),
        amount_at_maturity: a.string(),
        owner: a.string()
      }).authorization((allow) => [allow.ownerDefinedIn("owner"), allow.authenticated()]),
    Transactions: a
      .model({
        account_id: a.string(),
        type: a.string(),
        xtn_date: a.string(),
        amount: a.string(),
        holding_id: a.string(),
        owner: a.string()
      }).authorization((allow) => [allow.ownerDefinedIn("owner"), allow.authenticated()]),
  }).authorization((allow) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});