module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'individual-project',
      user:     'tedigc',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: { tableName: 'knex_migrations' }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL, 
    pool: {
      min: 2,
      max: 10
    },
    migrations: { tableName: 'knex_migrations' }
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'individual-project-test',
      user:     'tedigc',
      password: ''
    },
    migrations: { directory: 'knex_migrations' }
  }

};
