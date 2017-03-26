
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('excerpts').del()
    .then(function () {
      return Promise.all([

        // Inserts seed entries
        knex('excerpts').insert({id: 1, title: 'excerpt 1.1', body: 'this is the body of excerpt 1.1', owner_id: 1 }),
        knex('excerpts').insert({id: 2, title: 'excerpt 1.2', body: 'this is the body of excerpt 1.2', owner_id: 1 }),

        knex('excerpts').insert({id: 3, title: 'excerpt 2.1', body: 'this is the body of excerpt 2.1', owner_id: 2 }),
        knex('excerpts').insert({id: 4, title: 'excerpt 2.2', body: 'this is the body of excerpt 2.2', owner_id: 2 }),

        knex('excerpts').insert({id: 5, title: 'excerpt 3.1', body: 'this is the body of excerpt 3.1', owner_id: 3 }),
        knex('excerpts').insert({id: 6, title: 'excerpt 3.2', body: 'this is the body of excerpt 3.2', owner_id: 3 })

      ]);
    });
};
