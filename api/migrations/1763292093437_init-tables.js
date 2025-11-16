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
CREATE TABLE "Role" (
  "id" serial PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL
);
CREATE TABLE "Position" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) UNIQUE NOT NULL,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp,
  "is_deleted" boolean DEFAULT false NOT NULL
);
CREATE TABLE "Organization" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "comment" varchar(255),
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp,
  "is_deleted" boolean DEFAULT false NOT NULL
);
CREATE TABLE "Department" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) UNIQUE NOT NULL,
  "comment" varchar(255),
  "organization_id" integer NOT NULL REFERENCES "Organization"(id) ON DELETE CASCADE,
  "parent_id" integer REFERENCES "Department"(id) ON DELETE CASCADE,
  "created_at" timestamp DEFAULT current_timestamp,
  "is_deleted" boolean DEFAULT false NOT NULL,
  "updated_at" timestamp
);
CREATE TABLE "User" (
  "id" serial PRIMARY KEY,
  "first_name" varchar(50) NOT NULL,
  "last_name" varchar(50) NOT NULL,
  "patronymic" varchar(50),
  "login" varchar(255) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "role_id" integer NOT NULL REFERENCES "Role"(id) ON DELETE CASCADE,
  "created_at" timestamp DEFAULT current_timestamp,
  "is_deleted" boolean DEFAULT false NOT NULL,
  "updated_at" timestamp
);
CREATE TABLE "History" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "entity_type" varchar(50) NOT NULL,
  "entity_id" integer NOT NULL,
  "changed_fields" jsonb,
  "created_at" timestamp DEFAULT current_timestamp,
  "is_deleted" boolean DEFAULT false NOT NULL,
  "updated_at" timestamp
);
CREATE TABLE "Employee" (
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
  "department_id" integer DEFAULT NULL REFERENCES "Department"(id) ON DELETE CASCADE,
  "position_id" integer DEFAULT NULL REFERENCES "Position"(id) ON DELETE CASCADE,
  "salary" numeric DEFAULT NULL,
  "created_at" timestamp DEFAULT current_timestamp,
  "is_deleted" boolean DEFAULT false NOT NULL,
  "updated_at" timestamp
);
CREATE TABLE "File" (
  "id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "file" bytea NOT NULL,
  "employee_id" integer NOT NULL REFERENCES "Employee"(id) ON DELETE CASCADE,
  "created_at" timestamp DEFAULT current_timestamp,
  "is_deleted" boolean DEFAULT false NOT NULL,
  "updated_at" timestamp
);
CREATE TABLE "EmploymentOperation" (
  "id" serial PRIMARY KEY,
  "employee_id" integer NOT NULL REFERENCES "Employee"(id) ON DELETE CASCADE,
  "operation_type" varchar(50) NOT NULL,
  "department_id" integer REFERENCES "Department"(id) ON DELETE CASCADE,
  "position_id" integer REFERENCES "Position"(id) ON DELETE CASCADE,
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
DROP TABLE IF EXISTS "EmploymentOperation";
DROP TABLE IF EXISTS "File";
DROP TABLE IF EXISTS "Employee";
DROP TABLE IF EXISTS "History";
DROP TABLE IF EXISTS "User";
DROP TABLE IF EXISTS "Department";
DROP TABLE IF EXISTS "Organization";
DROP TABLE IF EXISTS "Position";
DROP TABLE IF EXISTS "Role";`);
};
