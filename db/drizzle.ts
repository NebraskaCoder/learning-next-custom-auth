import { config } from "dotenv";
import { drizzle } from "drizzle-orm/connect";

import { EntitiesSchema } from "./schema";

config({
  path: [
    ".env",
    ".env.development",
    ".env.production",
    ".env.local",
    ".env.development.local",
    ".env.production.local",
  ],
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle("node-postgres", {
  connection: process.env.DATABASE_URL,
  schema: EntitiesSchema,
});
