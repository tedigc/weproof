var express    = require('express');
var morgan     = require('morgan');
var path       = require('path');
var bodyParser = require('body-parser');

// routes
var users = require('./controllers/users');
var auth = require('./controllers/auth');

var port = process.env.PORT || 8888; 
var app  = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(morgan('dev'));
app.use(bodyParser.json());

// set up routes
app.use('/api/users', users);
app.use('/api/auth' , auth);

// serve up web application
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

var server = app.listen(port, function(err) {
  if(err) {
    console.error(err);
  } else {
    var host = server.address().address;
    var port = server.address().port;
    console.info("🌎  Server listening at http://%s:%s", host, port);
  }
});