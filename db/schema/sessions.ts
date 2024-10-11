import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  timestamp,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const sessionSources = ["web", "mobile", "machine-to-machine"] as const;

export const sessionSourceEnum = pgEnum("session_source", sessionSources);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().default(sql.raw(`gen_random_uuid()`)),
    createdAt: text("created_at").default(sql.raw(`now()`)),
    updatedAt: text("updated_at").default(sql.raw(`now()`)),
    sessionId: text("session_id").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    passKeyUsed: boolean("pass_key_used").notNull().default(false),
    twoFactorVerified: boolean("two_factor_verified").notNull().default(false),
    userAgent: text("user_agent"),
    initialIPAddress: text("initial_ip_address"),
    initialIPAddressReverseLookup: text("initial_ip_address_reverse_lookup"),
    source: sessionSourceEnum("source").notNull(),
    knownLocation: text("known_location"),
    adminComments: text("admin_comments"),
  },
  (table) => {
    return {
      sessionIdUserIdExpiresAtIndex: index(
        "session_id_user_id_expires_at_index"
      ).on(table.sessionId, table.userId, table.expiresAt),
      sessionId: index("session_id_index").on(table.sessionId),
      userId: index("user_id_index").on(table.userId),
      expiresAt: index("expires_at_index").on(table.expiresAt), // used for cleanup
    };
  }
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export type Session = typeof sessions;
export type SessionInsert = typeof sessions.$inferInsert;
export type SessionSelect = typeof sessions.$inferSelect;
