
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('task_submissions', function(table) {
      table.increments();
      table.specificType('pairs', 'int[][]');
      table.bigInteger('ownerId').unsigned().index().references('id').inTable('users');
      table.bigInteger('excerptId').unsigned().index().references('id').inTable('excerpts');
      table.timestamps();
    }),

  ]);
};

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('task_submissions');
  
};