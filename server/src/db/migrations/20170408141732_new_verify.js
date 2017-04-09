
exports.up = function(knex, Promise) {
  
  return knex.schema.table('tasks_verify', (table) => {
    table.dropColumns(['tasks_fix_id', 'accepted']);
    table.integer('chosen_edit');
    table.specificType('votes', 'boolean[]');
  });

};

exports.down = function(knex, Promise) {

  return knex.schema.table('tasks_verify', (table) => {
    table.bigInteger('tasks_fix_id').unsigned().index().references('id').inTable('tasks_fix').onDelete('CASCADE');
    table.boolean('accepted').defaultTo(false);
    table.dropColumn('chosen_edit');
    table.dropColumn('votes');
  });
  
};
