
exports.up = function(knex, Promise) {
  return Promise.all([

    // create the table for task submissions
    //
    knex.schema.createTable('tasks', function(table) {
      table.increments();
      table.bigInteger('owner_id').unsigned().index().references('id').inTable('users');
      table.bigInteger('excerpt_id').unsigned().index().references('id').inTable('excerpts');
      table.specificType('pairs', 'int[][]');
      table.enu('type', ['find', 'fix', 'verify']);
      table.timestamps();
    }),

    // modify the excerpt submissions to add types describing the excerpt's status
    //
    knex.schema.table('excerpts', function(table) {
      table.enu('status', ['accepted', 'rejected', 'pending']).defaultTo('pending');
      table.enu('stage', ['find', 'fix', 'verify', 'complete']).defaultTo('find');
    })

  ]);
};

exports.down = function(knex, Promise) {

  return Promise.all([

    knex.schema.dropTable('tasks'),

    knex.schema.table('excerpts', function(table) {
      table.dropColumn('status');
      table.dropColumn('stage');
    })

  ]);
};