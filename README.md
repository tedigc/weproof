# Individual Project

#### Quick start

Start postgreSQL. ***In its own window***, run the command:
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

#### Interacting with the database through the shell

In its own terminal window, type the command:

```
$ psql <dbname>
```

Some useful commands:

```
<dbname>=# \x auto   // Pretty print tables
<dbname>=# \dt       // List all tables
```

#### Building and deploying

...

#### Making migrations remotely

...