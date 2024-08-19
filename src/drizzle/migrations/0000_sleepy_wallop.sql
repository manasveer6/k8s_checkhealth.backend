CREATE TABLE IF NOT EXISTS "daily_outages" (
	"id" serial PRIMARY KEY NOT NULL,
	"deployment_name" varchar(255) NOT NULL,
	"namespace" varchar(255) NOT NULL,
	"outage_count" integer DEFAULT 0 NOT NULL,
	"date" date NOT NULL,
	CONSTRAINT "unique_deployment_outage" UNIQUE("deployment_name","namespace","date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "last_check_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"deployment_name" varchar(255) NOT NULL,
	"namespace" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"checked_at" timestamp DEFAULT now()
);
