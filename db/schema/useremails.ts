import { relations, sql } from "drizzle-orm";
import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";
import { logincredentials } from "./logincredentials";

export const useremails = pgTable("user_emails", {
  id: uuid("id").primaryKey().default(sql.raw(`gen_random_uuid()`)),
  createdAt: text("created_at").default(sql.raw(`now()`)),
  updatedAt: text("updated_at").default(sql.raw(`now()`)),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  email: text("email").notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
});

export const useremailsRelations = relations(useremails, ({ many, one }) => ({
  user: one(users, {
    fields: [useremails.userId],
    references: [users.id],
  }),
  loginCredentials: many(logincredentials),
}));

export type UserEmail = typeof useremails;
export type UserEmailInsert = typeof useremails.$inferInsert;
export type UserEmailSelect = typeof useremails.$inferSelect;
