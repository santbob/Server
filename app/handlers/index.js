'use strict';

var Hoek = require('hoek');

module.exports = {
    test: function(request, reply) {
        console.log("v1/test request payload is " + request.payload);
        reply(request.payload);
    },
    api: function(request, reply) {
        reply({
            status: 'ok'
        });
    }
};
