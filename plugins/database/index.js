// Load modules
var Mongoose = require('mongoose');


exports.register = function (server, options, next) {

  Mongoose.connect(options.url);

  if (process.env.NODE_ENV === 'development') {
    Mongoose.set('debug', true);
  }

  var connection = Mongoose.connection;
  connection.on('error', console.error.bind(console, 'connection error'));

  connection.once('open', function callback() {
    console.log('- Established database connection.');
    next();
  });
};

exports.register.attributes = {
  name: 'database'
};