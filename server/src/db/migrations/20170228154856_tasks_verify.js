
export function up(knex, Promise) {
  return knex.schema.createTable('tasks_verify', (table) => {
    table.increments();
    table.inherits('tasks');
    table.bigInteger('tasks_fix_id').unsigned().index().references('id').inTable('tasks_fix').onDelete('CASCADE');
    table.boolean('accepted').defaultTo(false);
    table.enu('type', ['find', 'fix', 'verify']).defaultTo('verify');
  });
};

export function down(knex, Promise) {
  return knex.schema.dropTable('tasks_verify');
};
