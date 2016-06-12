'use strict';

var Hoek = require('hoek');

module.exports = {
    test: function(request, reply) {
        reply(request.payload);
    },
    api: function(request, reply) {
        reply({
            status: 'ok'
        });
    }
};
