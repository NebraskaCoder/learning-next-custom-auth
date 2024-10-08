import { relations, sql } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";
import { useremails } from "./useremails";

export const logincredentials = pgTable("login_credentials", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  createdAt: text("created_at").default(sql.raw(`now()`)),
  updatedAt: text("updated_at").default(sql.raw(`now()`)),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  emailId: uuid("email_id")
    .notNull()
    .references(() => useremails.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  passwordIterations: integer("password_iterations").notNull(),
});

export const logincredentialsRelations = relations(
  logincredentials,
  ({ one }) => ({
    user: one(users, {
      fields: [logincredentials.userId],
      references: [users.id],
    }),
    email: one(useremails, {
      fields: [logincredentials.emailId],
      references: [useremails.id],
    }),
  })
);

export type LoginCredential = typeof logincredentials;
export type LoginCredentialInsert = typeof logincredentials.$inferInsert;
export type LoginCredentialSelect = typeof logincredentials.$inferSelect;
