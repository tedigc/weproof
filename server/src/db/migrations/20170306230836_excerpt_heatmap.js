
exports.up = function(knex, Promise) {
  return knex.schema.table('excerpts', function(table) {
    table.specificType('heatmap', 'int[]');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('excerpts', function(table) {
    table.dropColumn('heatmap');
  });
};
