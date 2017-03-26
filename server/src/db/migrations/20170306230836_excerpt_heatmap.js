
export function up(knex, Promise) {
  return knex.schema.table('excerpts', (table) => {
    table.specificType('heatmap', 'int[]');
  });
}

export function down(knex, Promise) {
  return knex.schema.table('excerpts', (table) => {
    table.dropColumn('heatmap');
  });
}
