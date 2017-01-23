
exports.up = function(knex, Promise) {
  return Promise.all([

    // create the table for task submissions
    //
    knex.schema.createTable('task_submissions', function(table) {
      table.increments();
      table.specificType('pairs', 'int[][]');
      table.bigInteger('ownerId').unsigned().index().references('id').inTable('users');
      table.bigInteger('excerptId').unsigned().index().references('id').inTable('excerpts');
      table.timestamps();
    }),

    // modify the excerpt submissions to add types describing the excerpt's status
    //
    knex.schema.table('excerpts', function(table) {
      table.enu('status', ['accepted', 'rejected', 'pending']);
      table.enu('stage', ['find', 'fix', 'verify']);
    })

  ]);
};

exports.down = function(knex, Promise) {

  return Promise.all([

    knex.schema.dropTable('task_submissions'),

    knex.schema.table('excerpts', function(table) {
      table.dropColumn('status');
      table.dropColumn('stage');
    })

  ]);
};