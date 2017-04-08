/**
 *
 *  This migration introduces a table specifically for tasks of type 'fix'. Fix tasks inherit from the base task_submissions
 *  table and provide a default type of 'fix'.
 *
 */

export function up(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('tasks_find', (table) => {
      table.increments();
      table.inherits('tasks');
      table.specificType('patches', 'int[][]');
      table.enu('type', ['find', 'fix', 'verify']).defaultTo('find');
    }),

    knex.schema.createTable('tasks_fix', (table) => {
      table.increments();
      table.inherits('tasks');
      table.integer('chosen_edit');
      table.string('correction');
      table.enu('type', ['find', 'fix', 'verify']).defaultTo('fix');
    }),

    knex.schema.table('excerpts', (table) => {
      table.specificType('recommended_edits', 'int[][]');
    })

  ]);
}

export function down(knex, Promise) {
  return Promise.all([

    knex.schema.dropTable('tasks_find'),

    knex.schema.dropTable('tasks_fix'),

    knex.schema.table('excerpts', (table) => {
      table.dropColumn('recommended_edits');
    })

  ]);
}
