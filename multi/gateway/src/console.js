'use strict';

var redis = require("redis");
var properties = require('node-properties-parser').readSync(__dirname + '/../resources/env.default.properties');

var gatewayControlQueue = properties['gateway.redis.gatewaycontrolqueue'];
if (!gatewayControlQueue)
    gatewayControlQueue = 'gateway';
//console.log(process.env.REDIS_PORT_6379_TCP_ADDR + ':' + process.env.REDIS_PORT_6379_TCP_PORT);
var client = redis.createClient(properties['gateway.redis.port'], properties['gateway.redis.host']);
//var client = redis.createClient(process.env.REDIS_PORT_6379_TCP_PORT, process.env.REDIS_PORT_6379_TCP_ADDR);

if (properties['gateway.redis.password']) {
    client.auth(properties['gateway.redis.password'], function(error, result) {
        if (error)
            console.log('ERROR connecting to redis: ' + error);
        else
            console.log('SUCCESSFULLY connected to redis');
    });
}

client.on("error", function (err) {
    console.log("Error " + err);
});

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

process.stdin.on('data', function (text) {
    //console.log('received data:', util.inspect(text));
    if (text === 'quit\n') {
        done();
    }
    else if (text.toLowerCase().indexOf('restart') == 0) {
        console.log('Sending Restart Message');
        client.publish(gatewayControlQueue, text.toLowerCase().trim());
    }
    else if (text.toLowerCase().indexOf('shutdown') == 0) {
        console.log('Sending Shutdown Message');
        client.publish(gatewayControlQueue, text.toLowerCase().trim());
    }
    else if (text.toLowerCase().indexOf('loglevel') == 0) {
        console.log('Sending LogLevel Message');
        client.publish(gatewayControlQueue, text.toLowerCase().trim());
    }
    else if (text.toLowerCase().indexOf('clientmessageresendinterval') == 0) {
        console.log('Sending clientMessageResendInterval Message');
        client.publish(gatewayControlQueue, text.toLowerCase().trim());
    }
    else if (text.toLowerCase().indexOf('clientcount') == 0) {
        console.log('Sending clientCount Message');
        client.publish(gatewayControlQueue, text.toLowerCase().trim());
    }
});

function done() {
    process.exit();
}

