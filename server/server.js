var express = require('express');
var morgan  = require('morgan');
var path    = require('path');

var port = process.env.PORT || 8888; 
var app  = express();

app.use(morgan('dev'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
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