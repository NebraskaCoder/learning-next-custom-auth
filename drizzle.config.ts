import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

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

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
