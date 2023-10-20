/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("borrower", (table) => {
    table.uuid("id").notNullable().primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.timestamp("registered_date").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("borrower");
};
