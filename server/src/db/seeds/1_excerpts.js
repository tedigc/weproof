
let body1 = 'This project aims to produce a web application that uses crowdsourcing to assist non-native English speakers with their written English. This is a demographic common to many British universities with a large international student population';
let body2 = 'Formally speaking, the project has two groups of primary stakeholders. The first group is made up of primarily non-native English speakers seeking assistance with their written English who, in the final product, should be able to:';
let body3 = 'Both target audiences will be able to view a summary of their individual use of the application. For example; workers will have a dashboard showing tasks they can complete and a history of their submissions, while users seeking assistance should be able to review any verified corrections they have received.';
let body4 = 'Secondary to these points, the project aims to provide a maintainable code base for future work, explore and effectively use contemporary web technologies, and provide a positive user experience by focusing on implementing an intuitive and responsive UI.';
let body5 = 'Estellés-Arolas and González-Ladrón-de-Guevara [1] attempt to address this question and others like it by attempting to form an “exhaustive and global definition” of crowdsourcing. They do this by providing an overview of crowdsourcing definitions found in literature';
let body6 = 'They then go on to use these traits to assess several popular online services (including but not limited to Amazon Mechanical Turk, Wikipedia and Delicious) to determine whether they use crowdsourcing techniques, and conclude that a crowdsourcing application will exhibit most, but not necessarily all of these traits.';

export function seed(knex, Promise) {
  // Deletes ALL existing entries
  return knex('excerpts').del()
    .then(function () {
      return Promise.all([

        // Inserts seed entries 
        knex('excerpts').insert({ title: 'excerpt 1.1', body: body1, owner_id: 1, heatmap : new Array(body1.length).fill(0) }),
        knex('excerpts').insert({ title: 'excerpt 1.2', body: body2, owner_id: 1, heatmap : new Array(body2.length).fill(0) }),

        knex('excerpts').insert({ title: 'excerpt 2.1', body: body3, owner_id: 2, heatmap : new Array(body3.length).fill(0) }),
        knex('excerpts').insert({ title: 'excerpt 2.2', body: body4, owner_id: 2, heatmap : new Array(body4.length).fill(0) }),

        knex('excerpts').insert({ title: 'excerpt 3.1', body: body5, owner_id: 3, heatmap : new Array(body5.length).fill(0) }),
        knex('excerpts').insert({ title: 'excerpt 3.2', body: body6, owner_id: 3, heatmap : new Array(body6.length).fill(0) })

      ]);
    });
}
