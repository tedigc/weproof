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

### Interacting with the database through the shell

In its own terminal window, type the command:

```
$ psql <dbname>
```

Some useful commands:

```
<dbname>=# \x auto   // Pretty print tables
<dbname>=# \dt       // List all tables
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

---

### Making migrations remotely

...

---

#### Misc notes on previous problems:

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
