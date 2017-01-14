# Individual Project

### Quick start

First, start postgreSQL ***in its own terminal window*** by running the command:
```
$ postgres -D /usr/local/var/postgres 
```

After that, in another terminal window, start the server and client applications concurrently with:

```
$ npm start
```

Or alternatively, run the server and client separately in their own individual windows, with these two commands:

```
$ npm run server
$ npm run client
```

---

### Building and deploying

To deploy to Heroku, first ensure that the client application's latest build is available. Once that is done, you can then push to Heroku.

```
$ npm run build
$ git add *
$ git commit -m "Deploy to Heroku"
$ git push heroku master --force
```

If there are any issues once deployed, the commit can be amended with:

```
$ git add *
$ git commit --amend
$ git push heroku master --force
```

**Working with the db remotely**

The database can be reset at any time with this command:

```
$ heroku pg:reset DATABASE
```

It can be rolled back with:

```
$ heroku run knex migrate:rollback --knexfile server/src/knexfile.js
```

Update the schema by making migrations using knex. This is done with:

```
$ heroku run knex migrate:latest --knexfile server/src/knexfile.js
```

---

### Working with the database

Migrations are incremental, reversable changes made to a databases schema during development. knex provides several tools for managing migrations, but here are some common ones used during this project's development.

**Creating a database** *(realistically only needs to be done once)*

```
$ createdb <dbname>
```

**Deleting the database and starting fresh**

The best way to do this is to first drop tables from the database *(including the migration tables)*:

```
$ psql <dbname>
$ <dbname>=# drop <tablename>; // do this for all tables
$ <dbname>=# \q
```

Then delete any unwanted migrations *(like duplicates)* and run `knex migrate:latest`:

```
$ cd server/src
$ cd knex migrate:latest
```

**Interacting with the database through the shell**
In its own terminal window, type the command:

```
$ psql <dbname>
```

**Some useful commands**

```
<dbname>=# \x auto   // Pretty print tables
<dbname>=# \dt       // List all tables
```

---

For annoying errors during development and their fixes, see the [Wiki](https://github.com/tedigc/individual-project/wiki)
