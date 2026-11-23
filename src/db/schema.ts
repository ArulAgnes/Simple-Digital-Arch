import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

// Web-workspace annotations only. Never a replacement for the protected research database.
// The API is append-only and has no update/delete operations.
export const researchNotes = pgTable("workspace_research_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").notNull(),
  snapshotId: varchar("snapshot_id", { length: 80 }).notNull(),
  title: varchar("title", { length: 120 }).notNull(),
  body: text("body").notNull(),
  kind: varchar("kind", { length: 30 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
