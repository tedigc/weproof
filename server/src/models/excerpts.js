import bookshelf from '../db/bookshelf';

module.exports = bookshelf.Model.extend({
  tableName: 'excerpts'
});