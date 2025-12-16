import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersModel } from "./users.model.js";

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => usersModel.id),
  short_link: varchar("short_link", { length: 40 }).notNull().unique(),
  original_link: varchar("original_link", { length: 2049 }).notNull(),
  click_count: integer("click_count").notNull().default(0),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
