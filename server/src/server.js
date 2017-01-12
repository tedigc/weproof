import express    from 'express';
import morgan     from 'morgan';
import path       from 'path';
import bodyParser from 'body-parser';

// routes
import users    from './controllers/users';
import auth     from './controllers/auth';
import excerpts from './controllers/excerpts';

var port = process.env.PORT || 8888; 
var app  = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../../client/build')));

app.use(morgan('dev'));
app.use(bodyParser.json());

// set up routes
app.use('/api/users'    , users);
app.use('/api/auth'     , auth);
app.use('/api/excerpts' , excerpts);

// serve up web application
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

var server = app.listen(port, (err) => {
  if(err) {
    console.error(err);
  } else {
    var host = server.address().address;
    var port = server.address().port;
    console.info("🌎  Server listening at http://%s:%s", host, port);
  }
});