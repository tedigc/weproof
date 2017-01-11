
exports.up = function(knex, Promise) {
  return knex.schema.createTable('excerpts', function(table) {
    table.increments();
    table.string('title').notNullable();
    table.text('excerpt').notNullable();
    table.bigInteger('ownerId').unsigned().index().references('id').inTable('users');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('excerpt');
};
