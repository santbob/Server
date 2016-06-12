var Hapi = require('hapi');
var routes = require('./app/routes');
var config = require('./config');
var jwt = require('jwt-simple');

var startServer = function(callback) {
    var server = new Hapi.Server({
        //cache: config.cache
    });


    var validateAuthFn = function(appId, appSecret, apiToken, callback) {

        console.log(appId, appSecret, apiToken);

        // We'll check against the appId and appSecret we have in the database, if appId and appKey doen't match, request will not proceed.
        // Any client that wants to talk to our server would need this appId and appKey.
        if (config.apiUsers[appId] !== appSecret) {
            callback("Invalid appId or appSecret", false, {});
        }

        // Now that appId and appKey is valid, we'll check if this request has a apiToken.
        // If it has a session token, we'll get the user object from cache and return that as credentials, which can be later accessed in request handler
        // If the apiToken is empty or not found we will treat this as guest user and we'll pass the guest user credentails.

        if (apiToken) {
            var decoded = jwt.decode(apiToken, config.jwt.secret);
            callback(null, true, decoded);
        } else {
            callback(null, true, {
                _id: 0,
                userId: 'guest'
            });
        }
    };

    var generateAuthToken = function(doc, next) {

        var objectToEncode = {
            _id: doc._id,
            userId: doc.userId,
            expires: new Date().getTime() + (86400 * 90 * 1000) // 90days in milliseconds, this field makes the token to be valid for 90days
        };

        var authToken = jwt.encode(objectToEncode, config.jwt.secret);
        next(null, authToken);
    };

    /* Add this method to server object so we can access it from any request, by request.server */
    server.method("generateAuthToken", generateAuthToken, {});

    server.connection({
        port: config.server.port,
        host: config.server.hostname
    });

    const consoleOptions = {
        reporters: [{
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout'],
        }]
    };
    server.register([require('vision'), require('inert'), {
        register: require('lout')
    }, {
        register: require('bassmaster')
    }, {
        register: require('./plugins/token-auth')
    }, {
        register: require('good'),
        consoleOptions
    }], function(err) {
        if (err) {
            throw err;
        }

        server.auth.strategy('token', 'token-auth-scheme', {
            validateFunc: validateAuthFn
        });

        //server.auth.default('session');
        server.route(routes);
        server.start(function(err) {
            if (err) {
                console.error('error message ' + err);
            }
            console.info('Hapi server started @ ' + server.info.uri);
            console.info('server started on port: ', server.info.port);
            callback(err, server);
        });
    });

}


// Make the server available as the top-level export of this module.
module.exports = startServer;
