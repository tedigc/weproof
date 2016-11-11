var express    = require('express');
var morgan     = require('morgan');
var path       = require('path');
var bodyParser = require('body-parser');

var webpack              = require('webpack');
var webpackMiddleware    = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig        = require('../webpack.dev.config.js');

// routes
var users = require('./controllers/users');

var port = process.env.PORT || 8888; 
var app  = express();

// configure webpack
const compiler = webpack(webpackConfig);
app.use(webpackMiddleware(compiler, {
  hot        : true,
  noInfo     : true,
  publicPath :  webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.use(express.static(__dirname));
app.use(morgan('dev'));
app.use(bodyParser.json());

// set up routes
app.use('/api/users', users);

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