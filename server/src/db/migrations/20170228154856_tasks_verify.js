
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tasks_verify', function(table) {
    table.increments();
    table.inherits('tasks');
    table.bigInteger('tasks_fix_id').unsigned().index().references('id').inTable('tasks_fix').onDelete('CASCADE');
    table.boolean('accepted').defaultTo(false);
    table.enu('type', ['find', 'fix', 'verify']).defaultTo('verify');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tasks_verify');
};
