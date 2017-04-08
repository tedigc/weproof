
export function up(knex, Promise) {
  return Promise.all([

    // create the table for task submissions
    //
    knex.schema.createTable('tasks', (table) => {
      table.increments();
      table.bigInteger('owner_id').unsigned().index().references('id').inTable('users').onDelete('CASCADE');
      table.bigInteger('excerpt_id').unsigned().index().references('id').inTable('excerpts').onDelete('CASCADE');
      table.enu('type', ['find', 'fix', 'verify']);
      table.timestamps();
    }),

    // modify the excerpt submissions to add types describing the excerpt's accepted
    //
    knex.schema.table('excerpts', (table) => {
      table.boolean('accepted').defaultTo(false);
      table.enu('stage', ['find', 'fix', 'verify', 'complete']).defaultTo('find');
    })

  ]);
}

export function down(knex, Promise) {

  return Promise.all([

    knex.schema.dropTable('tasks'),

    knex.schema.table('excerpts', (table) => {
      table.dropColumn('accepted');
      table.dropColumn('stage');
    })

  ]);
}