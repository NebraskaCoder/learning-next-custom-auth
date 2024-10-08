// Schema
import * as UsersSchema from "./users";
import * as UserEmailsSchema from "./useremails";
import * as SessionsSchema from "./sessions";

// Login Schema
import * as LoginCredentialsSchema from "./logincredentials";

export const EntitiesSchema = {
  ...UsersSchema,
  ...UserEmailsSchema,
  ...SessionsSchema,
  ...LoginCredentialsSchema,
} as const;
