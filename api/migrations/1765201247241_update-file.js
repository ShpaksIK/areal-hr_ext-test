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
ALTER TABLE file ADD COLUMN file_path varchar(255) NOT NULL;
ALTER TABLE file ADD COLUMN original_name varchar(255) NOT NULL;
ALTER TABLE file ADD COLUMN mime_type varchar(255) NOT NULL;
ALTER TABLE file ADD COLUMN size integer NOT NULL;
ALTER TABLE employment_operation ADD COLUMN created_at timestamp DEFAULT current_timestamp;
ALTER TABLE role ADD COLUMN created_at timestamp DEFAULT current_timestamp;
`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
ALTER TABLE file DROP COLUMN file_path;
ALTER TABLE file DROP COLUMN original_name;
ALTER TABLE file DROP COLUMN mime_type;
ALTER TABLE file DROP COLUMN size;
ALTER TABLE employment_operation DROP COLUMN created_at;
ALTER TABLE role DROP COLUMN created_at;`);
};
