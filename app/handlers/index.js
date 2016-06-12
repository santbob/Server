'use strict';

var Hoek = require('hoek');

module.exports = {
    hltokenize: function (request, reply) {
        console.log("v1/hltokenize request payload is " + request.payload);
        var cardNumber = request.payload.card && request.payload.card.number;
        if (cardNumber) {
            var response = {
                "object": "token",
                "token_value": "supt_EpreIBlKxfaEhKtZehcvszpu",
                "token_type": "supt",
                "token_expire": "2016-06-12T07:34:50.7071408Z",
                "card": {
                    "number": "************" + cardNumber.substring(cardNumber.length - 4)
                }
            };
            reply(response);
        } else {
            reply({code: 100, message: "cardnumber is mandatory"});
        }


    },
    api: function (request, reply) {
        reply({
            status: 'ok'
        });
    }
};
