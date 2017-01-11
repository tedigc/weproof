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

### Misc notes on previous problems:

##### 'Uncaught SyntaxError: Unexpected token <'

This can be caused by a number of things. The main way to resolve it *(I found)* was to ensure that the `index.html` and js files are being located/properly referenced. For example, when deploying to Heroku, I ran into this issue quite a lot, and it was caused by incorrectly importing static assets. To fix this, static files are set up using the following lines of code in `server.js`:

```
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../../client/build')));
```

and `index.html` is served up by this snippet of code from `server.js`:

```
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});
```
##### '[JsonWebTokenError: invalid signature]'

This appears when using the `authenticate` middleware used for certain serverside routes (e.g. creating excerpts). The most common cause is a difference in jwtSecret between when a token was originally signed and when it is decoded. In this particular instance, it happened because when a token was signed after login in `controllers/auth.js`, it was being signed with the wrong secret. This was fixed by changing this line:

```
    var jwtSecret = process.env.JWT_SECRET || 'mysecret';
```

to this:

```
    var jwtSecret = process.env.JWT_SECRET || config.jwtSecret;
```
