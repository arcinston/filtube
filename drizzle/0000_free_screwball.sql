CREATE TABLE `users` (
	`walletAddress` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`duration` integer DEFAULT 0,
	`description` text NOT NULL,
	`likes` integer DEFAULT 0,
	`dislikes` integer DEFAULT 0,
	`uploaded_at` text NOT NULL,
	`views` integer DEFAULT 0,
	`walletAddress` text NOT NULL,
	`videoCommp` text NOT NULL,
	`thumbnailCommp` text NOT NULL,
	`category` text NOT NULL,
	FOREIGN KEY (`walletAddress`) REFERENCES `users`(`walletAddress`) ON UPDATE no action ON DELETE cascade
);
