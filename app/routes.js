'use strict';
var defaultHandler = require('./handlers');
module.exports = [{
    //     method: '*',
    //     path: '/{p*}',
    //     handler: function(request, reply) {
    //         reply.redirect('/');
    //     }
    // }, {
    //     method: 'GET',
    //     path: '/{path*}',
    //     config: {
    //         auth: {
    //             strategy: 'token',
    //             mode: 'try'
    //         }
    //     },
    //     handler: {
    //         directory: {
    //             path: './.build',
    //             listing: false,
    //             index: true
    //         }
    //     }
    // }, {
    method: 'POST',
    path: '/v1/hltokenize',
    config: {
        auth: {
            strategy: 'token',
            mode: 'try'
        }
    },
    handler: defaultHandler.hltokenize
}, {
    method: 'POST',
    path: '/api',
    config: {
        auth: {
            strategy: 'token',
            mode: 'try'
        },
        payload: {
            maxBytes: 3145728 //maxBytes set to 3MB
        },
        timeout: {
            socket: 10 * 60 * 1000 // 10 minutes connection timeout
        }
    },
    handler: defaultHandler.api
}, {
    method: 'GET',
    path: '/status',
    handler: function(request, reply) {
        reply({
            status: 'ok'
        });
    }
}];
