CREATE TABLE `assets` (
	`id` text PRIMARY KEY NOT NULL,
	`deal_id` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`preview_mime` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL
);
