import { relations, sql } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { useremails } from "./useremails";
import { sessions } from "./sessions";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql.raw(`gen_random_uuid()`)),
  createdAt: text("created_at").default(sql.raw(`now()`)),
  updatedAt: text("updated_at").default(sql.raw(`now()`)),
  name: text("name").notNull(),
  age: integer("age"),
  profilePicUrl: text("profile_pic_url"),
  avatarFallbackText: text("avatar_fallback_text"),
});

export const usersRelations = relations(users, ({ many }) => ({
  emails: many(useremails),
  sessions: many(sessions),
}));

export type User = typeof users;
export type UserInsert = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;
