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
DROP TABLE IF EXISTS "EmploymentOperation";
DROP TABLE IF EXISTS "File";
DROP TABLE IF EXISTS "Employee";
DROP TABLE IF EXISTS "History";
DROP TABLE IF EXISTS "User";
DROP TABLE IF EXISTS "Department";
DROP TABLE IF EXISTS "Organization";
DROP TABLE IF EXISTS "Position";
DROP TABLE IF EXISTS "Role";`);

  pgm.sql(`
INSERT INTO role (name) VALUES
('Администратор'),
('Менеджер по персоналу');`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
DELETE FROM role;
TRUNCATE TABLE role RESTART IDENTITY CASCADE;`);
};
