'use strict';

var tls = require('tls');
var fs = require('fs');
const { exit } = require('process');
const prompt = require('prompt-sync')({sigint: true});

const PORT = 1337;
const HOST = '127.0.0.1'

// Pass the certs to the server and let it know to process even unauthorized certs.
var options = {
    key: fs.readFileSync('../pem/pkey.pem'),
    cert: fs.readFileSync('../pem/pucert.pem')
    
};

var client = tls.connect(PORT, HOST, options, function() {
    
    // client.enableTrace();
    // Check if the authorization worked
    console.log("CONNECTED AT %s, ON PORT %s", HOST,PORT);

    if (client.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
    } else {
        console.log("Connection not authorized: " + client.authorizationError)
    }

    var str = makeString();
    client.write(str);        

});

client.on("data", function(data) {

    console.log('\x1b[36m%s\x1b[0m','\nReceived: %s [it is %d bytes long]\n',
        data.toString().replace(/(\n)/gm,""),
        data.length);
    client.end();

});

client.on('close', function() {

    console.log("Connection closed");
    exit();
});

// When an error ocoures, show it.
client.on('error', function(error) {

    console.error(error);

    // Close the connection after the error occurred.
    client.destroy();

});

function makeString(){
    console.log("What kind of motivation do you need for today?\n");
    console.log("1. Motivation\n");
    console.log("2. Chuck noris facts\n");
    var value = prompt('type your choice?');
    // Send a friendly message
    return `{\"message\":\"Im the client sending you a message\",\"data\":${value}}`;
}
