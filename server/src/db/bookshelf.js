import knex from 'knex';
import bookshelf from 'bookshelf';
import knexConfig from './knexfile';

if(process.env.NODE_ENV === "production") { 
  module.exports = bookshelf(knex(knexConfig.production)) ;
} else {
  module.exports = bookshelf(knex(knexConfig.development));
}