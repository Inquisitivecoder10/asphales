import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const workspaces = sqliteTable('workspaces', {id:text('id').primaryKey(),payload:text('payload').notNull(),version:integer('version').notNull().default(0)});
export const assets = sqliteTable('assets', {id:text('id').primaryKey(),dealId:text('deal_id').notNull(),name:text('name').notNull(),mime:text('mime').notNull(),previewMime:text('preview_mime').notNull(),createdAt:text('created_at').notNull()});
