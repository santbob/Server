// Load modules

var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Server = require('../server');
var Path = require('path');

//declare internals

var internals = {};

// Test shortcuts

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var it = lab.test;


it('starts server and returns hapi server object', function (done) {

  Server(function (err, server) {

    expect(err).to.not.exist();
    expect(server).to.be.instanceof(Hapi.Server);

    server.stop(done);
  });
});
