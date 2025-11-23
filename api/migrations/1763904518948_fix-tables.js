/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
CREATE TABLE "role" (
  "id" serial PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL
);
CREATE TABLE "position" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) UNIQUE NOT NULL,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);
CREATE TABLE "organization" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "comment" varchar(255),
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);
CREATE TABLE "department" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) UNIQUE NOT NULL,
  "comment" varchar(255),
  "organization_id" integer NOT NULL REFERENCES "organization"(id) ON DELETE CASCADE,
  "parent_id" integer REFERENCES "department"(id) ON DELETE CASCADE,
  "created_at" timestamp DEFAULT current_timestamp,
  "deleted_at" timestamp,
  "updated_at" timestamp
);
CREATE TABLE "user" (
  "id" serial PRIMARY KEY,
  "first_name" varchar(50) NOT NULL,
  "last_name" varchar(50) NOT NULL,
  "patronymic" varchar(50),
  "login" varchar(255) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "role_id" integer NOT NULL REFERENCES "role"(id) ON DELETE CASCADE,
  "created_at" timestamp DEFAULT current_timestamp,
  "deleted_at" timestamp,
  "updated_at" timestamp
);
CREATE TABLE "history" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "entity_type" varchar(50) NOT NULL,
  "entity_id" integer NOT NULL,
  "changed_fields" jsonb,
  "created_at" timestamp DEFAULT current_timestamp,
  "deleted_at" timestamp,
  "updated_at" timestamp
);
CREATE TABLE "employee" (
  "id" serial PRIMARY KEY,
  "first_name" varchar(50) NOT NULL,
  "last_name" varchar(50) NOT NULL,
  "patronymic" varchar(50),
  "birth_date" date NOT NULL,
  "passport_series" varchar(4) NOT NULL,
  "passport_number" varchar(6) NOT NULL,
  "passport_issue_date" date NOT NULL,
  "passport_division_code" varchar(50) NOT NULL,
  "passport_issued_by" varchar(255) NOT NULL,
  "address_region" varchar(50) NOT NULL,
  "address_city" varchar(50) NOT NULL,
  "address_street" varchar(50) NOT NULL,
  "address_house" varchar(50) NOT NULL,
  "address_building" varchar(50),
  "address_apartment" varchar(50),
  "created_at" timestamp DEFAULT current_timestamp,
  "deleted_at" timestamp,
  "updated_at" timestamp
);
CREATE TABLE "file" (
  "id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "employee_id" integer NOT NULL REFERENCES "employee"(id) ON DELETE CASCADE,
  "created_at" timestamp DEFAULT current_timestamp,
  "deleted_at" timestamp,
  "updated_at" timestamp
);
CREATE TABLE "employment_operation" (
  "id" serial PRIMARY KEY,
  "employee_id" integer NOT NULL REFERENCES "employee"(id) ON DELETE CASCADE,
  "operation_type" varchar(50) NOT NULL,
  "department_id" integer REFERENCES "department"(id) ON DELETE CASCADE,
  "position_id" integer REFERENCES "position"(id) ON DELETE CASCADE,
  "salary" numeric
);`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
DROP TABLE IF EXISTS "employment_operation";
DROP TABLE IF EXISTS "file";
DROP TABLE IF EXISTS "employee";
DROP TABLE IF EXISTS "history";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "department";
DROP TABLE IF EXISTS "organization";
DROP TABLE IF EXISTS "position";
DROP TABLE IF EXISTS "role";`);
};
