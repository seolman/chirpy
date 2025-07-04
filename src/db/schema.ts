import { pgTable, timestamp, varchar, uuid, text } from "drizzle-orm/pg-core";

export type User = typeof users.$inferSelect;
export type UserResponse = Omit<typeof users.$inferSelect, "hashedPassword">;
export type NewUser = typeof users.$inferInsert;
export type Chirp = typeof chirps.$inferSelect;
export type NewChirp = typeof chirps.$inferInsert;
export type RefreshTokens = typeof refreshTokens.$inferSelect;
export type NewRefreshTokens = typeof refreshTokens.$inferInsert;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password").notNull().default("unset")
});

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: varchar("body", { length: 256 }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull()
});

export const refreshTokens = pgTable("refresh_tokens", {
  token: varchar("token", { length: 256 }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull()
});
