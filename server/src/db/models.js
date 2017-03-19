import bookshelf from '../db/bookshelf';

let User = bookshelf.Model.extend({
  tableName: 'users',
  excerpts: () => { return this.hasMany(Excerpt); }
});

let Excerpt = bookshelf.Model.extend({
  tableName: 'excerpts',
  task         : () => { return this.hasMany(Task); },
  tasks_find   : () => { return this.hasMany(TaskFind); },
  tasks_fix    : () => { return this.hasMany(TaskFix); },
  tasks_verify : () => { return this.hasMany(TaskVerify); }
});

let Task = bookshelf.Model.extend({
  tableName: 'tasks',
  owner   : () => { return this.belongsTo(User, 'owner_id'); },
  excerpt : () => { return this.belongsTo(Excerpt, 'excerpt_id'); }
});

let TaskFind = bookshelf.Model.extend({
  tableName: 'tasks_find',
  owner   : () => { return this.belongsTo(User, 'owner_id'); },
  excerpt : () => { return this.belongsTo(Excerpt, 'excerpt_id'); }
});

let TaskFix = bookshelf.Model.extend({
  tableName: 'tasks_fix',
  owner         : () => { return this.belongsTo(User, 'owner_id'); },
  excerpt       : () => { return this.belongsTo(Excerpt, 'excerpt_id'); },
  verifications : () => { return this.hasMany(TaskVerify); }
});

let TaskVerify = bookshelf.Model.extend({
  tableName: 'tasks_verify',
  owner   : () => { return this.belongsTo(User, 'owner_id'); },
  excerpt : () => { return this.belongsTo(Excerpt, 'excerpt_id'); },
  taskFix : () => { return this.belongsTo(TaskFix); }
});

export { User, Excerpt, Task, TaskFind, TaskFix, TaskVerify };