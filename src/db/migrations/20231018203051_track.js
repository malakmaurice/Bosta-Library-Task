/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("track", (table) => {
    table.increments("id").primary().notNullable();
    table
      .uuid("book_id")
      .notNullable()
      .references("id")
      .inTable("book")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .uuid("borrower_id")
      .notNullable()
      .references("id")
      .inTable("borrower")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("check_in").defaultTo(knex.fn.now());
    table.timestamp("check_out").nullable();
    table.timestamp("expected_check_out").notNullable();
    table.boolean("is_returned").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("track");
};
