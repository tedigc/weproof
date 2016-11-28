var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'dist/');
var APP_DIR   = path.resolve(__dirname, 'client/');

var config = {
  entry : [
    'webpack-hot-middleware/client',
    APP_DIR + '/index.js'
  ],
  output : {
    path       :  BUILD_DIR,
    publicPath :  '/',
    filename   : 'bundle.js'
  },
  module : {
    loaders : [ 
      {
        test    : /\.jsx?$/,
        include : [
          __dirname + '/client/',
          __dirname + '/server/',
          __dirname + '/server/shared'
        ],
        loaders : [ 'babel-loader' ],
        exclude : /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['', '.jsx', '.js', '.json'],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },
  plugins : [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  node : {
    net: 'empty',
    dns: 'empty'
  },
  devTools : 'eval-source-map'
}

module.exports = config;