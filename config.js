'use strict';
var config = {};

config.server = {
  port: process.env.PORT || 8080,
  host: process.env.HOST || '0.0.0.0'
};

config.redis = {
  port: 10350,
  host: 'pub-redis-10350.us-east-1-3.3.ec2.garantiadata.com',
  auth_pass: '5pMdno69ly839Oo'
};

config.jwt = {
  secret: process.env.JWT_SECRET || 'meera'
};

config.upload = {
  maxBytes: 100000000 // 100 MB
};

config.apiUsers = {
    "mobile": "mobile"
};

module.exports = config;