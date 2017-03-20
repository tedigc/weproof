import bookshelf from '../db/bookshelf';

let User = bookshelf.Model.extend({
  tableName : 'users',
  excerpts  : function() { return this.hasMany(Excerpt); }
});

let Excerpt = bookshelf.Model.extend({
  tableName    : 'excerpts',
  tasks        : function() { return this.hasMany(Task); },
  tasks_find   : function() { return this.hasMany(TaskFind); },
  tasks_fix    : function() { return this.hasMany(TaskFix); },
  tasks_verify : function() { return this.hasMany(TaskVerify); }
});

let Task = bookshelf.Model.extend({
  tableName : 'tasks',
  owner     : function() { return this.belongsTo(User, 'owner_id'); },
  excerpt   : function() { return this.belongsTo(Excerpt, 'excerpt_id'); }
});

let TaskFind = bookshelf.Model.extend({
  tableName : 'tasks_find',
  owner     : function() { return this.belongsTo(User, 'owner_id'); },
  excerpt   : function() { return this.belongsTo(Excerpt, 'excerpt_id'); }
});

let TaskFix = bookshelf.Model.extend({
  tableName     : 'tasks_fix',
  owner         : function() { return this.belongsTo(User, 'owner_id'); },
  excerpt       : function() { return this.belongsTo(Excerpt, 'excerpt_id'); },
  verifications : function() { return this.hasMany(TaskVerify); }
});

let TaskVerify = bookshelf.Model.extend({
  tableName : 'tasks_verify',
  owner     : function() { return this.belongsTo(User, 'owner_id'); },
  excerpt   : function() { return this.belongsTo(Excerpt, 'excerpt_id'); },
  taskFix   : function() { return this.belongsTo(TaskFix); }
});

export { User, Excerpt, Task, TaskFind, TaskFix, TaskVerify };