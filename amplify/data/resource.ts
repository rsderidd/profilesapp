import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    UserProfile: a
      .model({
        email: a.string(),
        profileOwner: a.string(),
        test: a.string()
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
        starting_balance: a.float()
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),
    Holdings: a
      .model({
        account_id: a.string(),
        name: a.string(),
        purchase_date: a.string(),
        amount_paid: a.float(),
        maturity_date: a.string(),
        rate: a.float(),
        amount_at_maturity: a.float()
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),
    Transactions: a
      .model({
        account_id: a.string(),
        type: a.string(),
        xtn_date: a.string(),
        amount: a.float(),
        holding_id: a.string()
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),
        
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);
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