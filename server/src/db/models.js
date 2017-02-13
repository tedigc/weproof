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

let Task = bookshelf.Model.extend({
  tableName: 'tasks',
  excerpt: function() {
    return this.belongsTo(Excerpt, 'excerpt_id');
  }
});

let TaskFind = bookshelf.Model.extend({
  tableName: 'tasks_find',
});

let TaskFix = bookshelf.Model.extend({
  tableName: 'tasks_fix',
});

export { User, Excerpt, Task, TaskFind, TaskFix };