module.exports = {

  production: {
    client     : 'postgresql',
    connection : process.env.DATABASE_URL, 
    pool : {
      min: 2,
      max: 10
    },
    migrations : { 
      tableName : 'knex_migrations',
    }
  },


  development: {
    client     : 'postgresql',
    connection : {
      database : 'individual-project',
      user     : 'tedigc',
      password : ''
    },
    pool : {
      min : 2,
      max : 10
    },
    migrations : { 
      tableName : 'knex_migrations',
      directory : __dirname + '/migrations'
    },
    seeds      : {
      directory : __dirname + '/seeds'
    }
  },


  test: {
    client     : 'postgresql',
    connection : {
      database : 'individual-project-test',
      user     : 'tedigc',
      password : ''
    },
    pool : {
      min : 2,
      max : 10
    },
    migrations : { 
      tableName : 'knex_migrations',
      directory : __dirname + '/migrations'
    },
    seeds      : {
      directory : __dirname + '/seeds'
    }
  }


};
