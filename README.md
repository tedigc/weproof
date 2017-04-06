# WeProof

WeProof is a web application that uses the power of crowdsourcing to help non-native English speakers proof-read their written English, be it in the form of essays, reports or dissertations. This project endeavors to take advantage of the untapped crowdsourcing potential of Universities, in the form of students and staff, and provide much needed assistance to the international and non-native English speaking student populations at Universities around the country.

## Quick Start

Clone the repository. Ensure you have npm installed and install all necessary node modules for the root, client, and server 
by running:

```
$ git clone https://github.com/tedigc/weproof
$ cd weproof
$ npm install
$ cd client && npm install
$ cd ../server && npm install
$ cd ..
```

Next, we're going to set up the development and test databases. Make sure you have PostgreSQL installed on your machine, and run the following commands:

```
$ postgres -D /usr/local/var/postgres 
$ createdb weproof
$ createdb weproof-test
```

With the databases created, we need to make all of the knex migrations to set up the database schema. There are scripts in the `/server` directory to do this for you. Simple run the following commands:

```
$ cd server
$ npm run migrate:development
$ npm run migrate:test
```

Everything should be ready to work with now. To start the application, ensure you're in the root of the project and run the command:

```
$ npm start
```

This will run both the server and client applications concurrently. Navigate to `localhost:3000` to start using the application.

---

For more useful information, see the project's [Wiki](https://github.com/tedigc/individual-project/wiki).
