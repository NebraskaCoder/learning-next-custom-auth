import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const sessionSourceEnum = pgEnum("session_source", [
  "web",
  "mobile",
  "machine-to-machine",
]);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().default(sql.raw(`gen_random_uuid()`)),
  createdAt: text("created_at").default(sql.raw(`now()`)),
  updatedAt: text("updated_at").default(sql.raw(`now()`)),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  expiresAt: integer("expires_at").notNull(),
  passKeyUsed: boolean("pass_key_used").notNull().default(false),
  twoFactorVerified: boolean("two_factor_verified").notNull().default(false),
  userAgent: text("user_agent"),
  initialIPAddress: text("initial_ip_address"),
  initialIPAddressReverseLookup: text("initial_ip_address_reverse_lookup"),
  source: sessionSourceEnum("source").notNull(),
  knownLocation: text("known_location"),
  adminComments: text("admin_comments"),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export type Session = typeof sessions;
export type SessionInsert = typeof sessions.$inferInsert;
export type SessionSelect = typeof sessions.$inferSelect;
