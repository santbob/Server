var Boom = require('boom');
var Hoek = require('hoek');

var internals = {};


exports.register = function(plugin, options, next) {
    plugin.auth.scheme('token-auth-scheme', internals.implementation);
    next();
};

exports.register.attributes = {
    pkg: require("./package.json")
};

internals.implementation = function(server, options) {

    Hoek.assert(options, 'Missing basic auth strategy options');
    Hoek.assert(typeof options.validateFunc === 'function', 'options.validateFunc must be a valid function in basic scheme');

    var settings = Hoek.clone(options);

    var scheme = {
        authenticate: function(request, reply) {
            var validate = function() {
                var req = request.raw.req;
                var appId = req.headers.appid; //An appId will be given for webapp, mobile app, one each for each third party inorder to access our API, this key cannot be rest
                var appSecret = req.headers.appsecret; //An appSecret will be given for webapp, mobile app, one each for each third party inorder to access our API , this value can be reset
                var authToken = req.headers.authtoken; //This is temporary token genorated by the server once a user is authenticated

                if (!appId) {
                    return reply(Boom.unauthorized('appId missing from the header'));
                }
                if (!appSecret) {
                    return reply(Boom.unauthorized('appSecret missing from the header.'));
                }

                settings.validateFunc(appId, appSecret, authToken, function(err, isValid, credentials) {

                    credentials = credentials || null;

                    if (err) {
                        return reply(Boom.unauthorized(err + ' Authentication faied!'), {
                            credentials: credentials,
                            log: {
                                tags: ['auth', 'token'],
                                data: err
                            }
                        });
                    }

                    if (!isValid) {
                        return reply(Boom.unauthorized('Bad appId or appSecret or authToken'), {
                            credentials: credentials
                        });
                    }

                    if (!credentials || typeof credentials !== 'object') {

                        return reply(Boom.badImplementation('Bad credentials object received for token auth validation'), {
                            log: {
                                tags: 'credentials'
                            }
                        });
                    }

                    // Authenticated

                    return reply(null, {
                        credentials: credentials
                    });
                });
            };
            validate();
        }
    };

    return scheme;
};
