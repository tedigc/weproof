import bookshelf from '../db/bookshelf';

let User = bookshelf.Model.extend({
  tableName: 'users'
});

let Excerpt = bookshelf.Model.extend({
  tableName: 'excerpts',
  taskSubmissions: function() {
    return this.hasMany(TaskSubmission);
  }
});

let TaskSubmission = bookshelf.Model.extend({
  tableName: 'task_submissions',
  excerpt: function() {
    return this.belongsTo(Excerpt, 'excerpt_id');
  }
});

export { User, Excerpt, TaskSubmission };