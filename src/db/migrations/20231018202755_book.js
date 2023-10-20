/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("book", (table) => {
    table.uuid("id").notNullable().primary();
    table.string("title").notNullable();
    table.string("author").notNullable();
    table.integer("quantity").notNullable();
    table.integer("available_quantity").notNullable();
    table.string("location").nullable();
    table.integer("ISBN").notNullable();
    table.index("title", "title_index");
    table.index("author", "author_index");
    table.index("ISBN", "ISBN_index");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("book");
};
