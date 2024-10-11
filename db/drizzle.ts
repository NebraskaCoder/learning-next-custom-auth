import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

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

// TODO: This will be changed in a near future update: https://github.com/drizzle-team/drizzle-orm/discussions/3097

const client = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(client, { schema: EntitiesSchema });
