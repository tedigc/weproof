/**
 *
 *  This migration introduces a table specifically for tasks of type 'fix'. Fix tasks inherit from the base task_submissions
 *  table and provide a default type of 'fix'.
 *
 */

exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('tasks_find', function(table) {
      table.increments();
      table.inherits('tasks');
      table.enu('type', ['find', 'fix', 'verify']).defaultTo('find');
    }),

    knex.schema.createTable('tasks_fix', function(table) {
      table.inherits('tasks');
      table.specificType('corrections', 'text[]');
      table.enu('type', ['find', 'fix', 'verify']).defaultTo('fix');
    }),

    knex.schema.table('excerpts', function(table) {
      table.specificType('recommended_edits', 'int[][]');
    })

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([

    knex.schema.dropTable('tasks_find'),

    knex.schema.dropTable('tasks_fix'),

    knex.schema.table('excerpts', function(table) {
      table.dropColumn('recommended_edits');
    })

  ]);
};