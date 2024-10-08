DO $$ BEGIN
 CREATE TYPE "public"."session_source" AS ENUM('web', 'mobile', 'machine-to-machine');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "login_credentials" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "login_credentials_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" text DEFAULT now(),
	"updated_at" text DEFAULT now(),
	"user_id" uuid NOT NULL,
	"email_id" uuid NOT NULL,
	"password_hash" text NOT NULL,
	"password_salt" text NOT NULL,
	"password_iterations" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" text DEFAULT now(),
	"updated_at" text DEFAULT now(),
	"user_id" uuid NOT NULL,
	"expires_at" integer NOT NULL,
	"pass_key_used" boolean DEFAULT false NOT NULL,
	"two_factor_verified" boolean DEFAULT false NOT NULL,
	"user_agent" text,
	"initial_ip_address" text,
	"initial_ip_address_reverse_lookup" text,
	"source" "session_source" NOT NULL,
	"known_location" text,
	"admin_comments" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" text DEFAULT now(),
	"updated_at" text DEFAULT now(),
	"user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" text DEFAULT now(),
	"updated_at" text DEFAULT now(),
	"name" text NOT NULL,
	"age" integer,
	"profile_pic_url" text,
	"avatar_fallback_text" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "login_credentials" ADD CONSTRAINT "login_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "login_credentials" ADD CONSTRAINT "login_credentials_email_id_user_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."user_emails"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_emails" ADD CONSTRAINT "user_emails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
