import knex from 'knex';
import bookshelf from 'bookshelf';
import knexConfig from './knexfile';

if(process.env.NODE_ENV === "production") { 
  console.log("[ PRODUCTION ] Database configured")
  module.exports = bookshelf(knex(knexConfig.production)) ;
} else {
  console.log("[ DEVELOPMENT ] Database configured")
  module.exports = bookshelf(knex(knexConfig.development));
}