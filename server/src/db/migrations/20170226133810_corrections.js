
exports.up = function(knex, Promise) {
  
  return knex.schema.createTable('corrections', function(table) {
    table.increments();
    table.bigInteger('owner_id').unsigned().index().references('id').inTable('users');
    table.bigInteger('excerpt_id').unsigned().index().references('id').inTable('excerpts');
    table.integer('chosen_edit').notNull();
    table.string('correction').notNull();
    table.enu('status', ['accepted', 'rejected', 'pending']).defaultTo('pending');
    table.timestamps();
  });

};

exports.down = function(knex, Promise) {
  
  return knex.schema.dropTable('corrections');

};
