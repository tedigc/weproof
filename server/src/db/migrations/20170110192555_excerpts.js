
exports.up = function(knex, Promise) {
  
  return knex.schema.createTable('excerpts', function(table) {
    table.increments();
    table.string('title').notNullable();
    table.text('body').notNullable();
    table.bigInteger('owner_id').unsigned().index().references('id').inTable('users').notNullable().onDelete('CASCADE');
    table.timestamps(true, true);
  });
  
};

exports.down = function(knex, Promise) {
  
  return knex.schema.dropTable('excerpts');

};
