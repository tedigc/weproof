
export function up(knex, Promise) {

  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password_digest').notNullable();
    table.timestamps();
  });

}

export function down(knex, Promise) {
  
  return knex.schema.dropTable('users');

}
