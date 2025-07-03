import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Chirp = typeof chirps.$inferSelect;
export type NewChirp = typeof chirps.$inferInsert;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
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
