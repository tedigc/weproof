
exports.up = function(knex, Promise) {
  
  return Promise.all([

    knex.schema.table('tasks_fix', (table) => {
      table.integer('accept_votes').defaultTo(0);
    }),

    knex.schema.table('tasks_verify', (table) => {
      table.dropColumns(['tasks_fix_id', 'accepted']);
      table.integer('chosen_edit');
    })

  ]);

};

exports.down = function(knex, Promise) {

  return Promise.all([

    knex.schema.table('tasks_fix', (table) => {
      table.dropColumn('accept_votes');
    }),

    knex.schema.table('tasks_verify', (table) => {
      table.bigInteger('tasks_fix_id').unsigned().index().references('id').inTable('tasks_fix').onDelete('CASCADE');
      table.boolean('accepted').defaultTo(false);
      table.dropColumn('chosen_edit');
    })

  ]);
  
};
