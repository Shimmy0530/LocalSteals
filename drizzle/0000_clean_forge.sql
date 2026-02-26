CREATE TABLE `deals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text,
	`title` text NOT NULL,
	`description` text,
	`url` text NOT NULL,
	`image_url` text,
	`price` real,
	`original_price` real,
	`store` text,
	`source` text NOT NULL,
	`category` text,
	`is_big_box` integer DEFAULT false,
	`is_chicagoland` integer DEFAULT false,
	`published_at` text,
	`fetched_at` text NOT NULL,
	`expires_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `deals_external_id_unique` ON `deals` (`external_id`);--> statement-breakpoint
CREATE TABLE `fcm_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fcm_tokens_token_unique` ON `fcm_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `feed_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`type` text NOT NULL,
	`active` integer DEFAULT true,
	`last_fetched_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feed_sources_url_unique` ON `feed_sources` (`url`);--> statement-breakpoint
CREATE TABLE `keywords` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`keyword` text NOT NULL,
	`active` integer DEFAULT true,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `keywords_keyword_unique` ON `keywords` (`keyword`);