import knex from 'knex';
import bookshelf from 'bookshelf';
import knexConfig from './knexfile';

let env = process.env.NODE_ENV;

if(env === "production")  module.exports = bookshelf(knex(knexConfig.production));
if(env === "development") module.exports = bookshelf(knex(knexConfig.development));
if(env === "test")        module.exports = bookshelf(knex(knexConfig.test));
if(env === undefined)     module.exports = bookshelf(knex(knexConfig.development));
