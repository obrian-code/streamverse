import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // ENUM types
    await queryRunner.query(
      `CREATE TYPE "public"."user_role" AS ENUM('admin', 'user', 'editor')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."content_status" AS ENUM('active', 'inactive', 'coming_soon')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."content_type" AS ENUM('movie', 'series', 'channel', 'documentary', 'sport', 'news')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."channel_category" AS ENUM('entertainment', 'sports', 'news', 'documentary', 'movies', 'music', 'kids', 'education')`,
    );

    // Users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "role" "public"."user_role" DEFAULT 'user',
        "avatar" VARCHAR(500),
        "reset_token" VARCHAR(500),
        "reset_token_expires" TIMESTAMPTZ,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )`
    );

    // Channels
    await queryRunner.query(`
      CREATE TABLE "channels" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "logo" VARCHAR(500),
        "category" "public"."channel_category" DEFAULT 'entertainment',
        "stream_url" VARCHAR(500) NOT NULL,
        "dash_url" VARCHAR(500),
        "country" VARCHAR(100),
        "language" VARCHAR(50),
        "status" "public"."content_status" DEFAULT 'active',
        "epg_data" JSONB DEFAULT '[]',
        "viewers_count" INTEGER DEFAULT 0,
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )`
    );

    // Movies
    await queryRunner.query(`
      CREATE TABLE "movies" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "synopsis" TEXT,
        "poster" VARCHAR(500),
        "backdrop" VARCHAR(500),
        "logo" VARCHAR(500),
        "category" VARCHAR(100),
        "genres" TEXT[] DEFAULT '{}',
        "tags" TEXT[] DEFAULT '{}',
        "duration" INTEGER,
        "release_date" DATE,
        "rating" DECIMAL(3,1) DEFAULT 0,
        "maturity_rating" VARCHAR(10) DEFAULT 'PG-13',
        "video_url" VARCHAR(500),
        "trailer_url" VARCHAR(500),
        "director" VARCHAR(255),
        "cast_members" TEXT[] DEFAULT '{}',
        "status" "public"."content_status" DEFAULT 'active',
        "is_featured" BOOLEAN DEFAULT false,
        "views_count" INTEGER DEFAULT 0,
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )`
    );

    // Series
    await queryRunner.query(`
      CREATE TABLE "series" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "synopsis" TEXT,
        "poster" VARCHAR(500),
        "backdrop" VARCHAR(500),
        "logo" VARCHAR(500),
        "category" VARCHAR(100),
        "genres" TEXT[] DEFAULT '{}',
        "tags" TEXT[] DEFAULT '{}',
        "release_date" DATE,
        "rating" DECIMAL(3,1) DEFAULT 0,
        "maturity_rating" VARCHAR(10) DEFAULT 'PG-13',
        "trailer_url" VARCHAR(500),
        "status" "public"."content_status" DEFAULT 'active',
        "is_featured" BOOLEAN DEFAULT false,
        "views_count" INTEGER DEFAULT 0,
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )`
    );

    // Episodes
    await queryRunner.query(`
      CREATE TABLE "episodes" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "series_id" UUID REFERENCES "series"("id") ON DELETE CASCADE,
        "season" INTEGER NOT NULL,
        "episode_number" INTEGER NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "thumbnail" VARCHAR(500),
        "video_url" VARCHAR(500) NOT NULL,
        "duration" INTEGER,
        "air_date" DATE,
        "is_featured" BOOLEAN DEFAULT false,
        "views_count" INTEGER DEFAULT 0,
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE("series_id", "season", "episode_number")
      )`
    );

    // Favorites
    await queryRunner.query(`
      CREATE TABLE "favorites" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
        "content_id" UUID NOT NULL,
        "content_type" "public"."content_type" NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE("user_id", "content_id", "content_type")
      )`
    );

    // History
    await queryRunner.query(`
      CREATE TABLE "history" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
        "content_id" UUID NOT NULL,
        "content_type" "public"."content_type" NOT NULL,
        "season" INTEGER,
        "episode_id" UUID REFERENCES "episodes"("id") ON DELETE SET NULL,
        "progress" INTEGER DEFAULT 0,
        "completed" BOOLEAN DEFAULT false,
        "watched_at" TIMESTAMPTZ DEFAULT NOW(),
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )`
    );

    // Categories
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(100) NOT NULL,
        "slug" VARCHAR(100) UNIQUE NOT NULL,
        "description" TEXT,
        "image" VARCHAR(500),
        "display_order" INTEGER DEFAULT 0,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMPTZ DEFAULT NOW()
      )`
    );

    // Banners
    await queryRunner.query(`
      CREATE TABLE "banners" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" VARCHAR(255) NOT NULL,
        "subtitle" TEXT,
        "image" VARCHAR(500),
        "video_url" VARCHAR(500),
        "content_id" UUID,
        "content_type" VARCHAR(50),
        "link_url" VARCHAR(500),
        "display_order" INTEGER DEFAULT 0,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )`
    );

    // EPG Programs
    await queryRunner.query(`
      CREATE TABLE "epg_programs" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "channel_id" UUID REFERENCES "channels"("id") ON DELETE CASCADE,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "start_time" TIMESTAMPTZ NOT NULL,
        "end_time" TIMESTAMPTZ NOT NULL,
        "category" VARCHAR(100),
        "season" INTEGER,
        "episode" INTEGER,
        "image" VARCHAR(500),
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT "valid_time_range" CHECK ("end_time" > "start_time")
      )`
    );

    // View Stats
    await queryRunner.query(`
      CREATE TABLE "view_stats" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "content_id" UUID NOT NULL,
        "content_type" "public"."content_type" NOT NULL,
        "user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
        "watched_duration" INTEGER DEFAULT 0,
        "completed" BOOLEAN DEFAULT false,
        "device_type" VARCHAR(50),
        "country" VARCHAR(100),
        "viewed_at" TIMESTAMPTZ DEFAULT NOW()
      )`
    );

    // Indexes
    await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users"("email")`);
    await queryRunner.query(`CREATE INDEX "idx_movies_category" ON "movies"("category")`);
    await queryRunner.query(`CREATE INDEX "idx_movies_status" ON "movies"("status")`);
    await queryRunner.query(
      `CREATE INDEX "idx_movies_featured" ON "movies"("is_featured") WHERE "is_featured" = true`,
    );
    await queryRunner.query(`CREATE INDEX "idx_series_category" ON "series"("category")`);
    await queryRunner.query(`CREATE INDEX "idx_series_status" ON "series"("status")`);
    await queryRunner.query(`CREATE INDEX "idx_episodes_series" ON "episodes"("series_id")`);
    await queryRunner.query(
      `CREATE INDEX "idx_episodes_season" ON "episodes"("series_id", "season")`,
    );
    await queryRunner.query(`CREATE INDEX "idx_favorites_user" ON "favorites"("user_id")`);
    await queryRunner.query(`CREATE INDEX "idx_history_user" ON "history"("user_id")`);
    await queryRunner.query(
      `CREATE INDEX "idx_history_recent" ON "history"("user_id", "watched_at" DESC)`,
    );
    await queryRunner.query(`CREATE INDEX "idx_channels_category" ON "channels"("category")`);
    await queryRunner.query(`CREATE INDEX "idx_channels_status" ON "channels"("status")`);
    await queryRunner.query(`CREATE INDEX "idx_epg_channel" ON "epg_programs"("channel_id")`);
    await queryRunner.query(
      `CREATE INDEX "idx_epg_time" ON "epg_programs"("start_time", "end_time")`,
    );
    await queryRunner.query(`CREATE INDEX "idx_view_stats_content" ON "view_stats"("content_id")`);
    await queryRunner.query(`CREATE INDEX "idx_view_stats_date" ON "view_stats"("viewed_at")`);

    // Full-text search indexes
    await queryRunner.query(`
      CREATE INDEX "idx_movies_search"
      ON "movies"
      USING gin(to_tsvector('spanish', "title" || ' ' || COALESCE("description", '')))
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_series_search"
      ON "series"
      USING gin(to_tsvector('spanish', "title" || ' ' || COALESCE("description", '')))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_email"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_movies_category"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_movies_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_movies_featured"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_series_category"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_series_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_episodes_series"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_episodes_season"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_favorites_user"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_history_user"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_history_recent"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_channels_category"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_channels_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_epg_channel"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_epg_time"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_view_stats_content"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_view_stats_date"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_movies_search"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_series_search"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "view_stats"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "epg_programs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "banners"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "history"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "favorites"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "episodes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "series"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "movies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "channels"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    // Drop ENUM types
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."channel_category"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."content_type"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."content_status"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."user_role"`);
  }
}
