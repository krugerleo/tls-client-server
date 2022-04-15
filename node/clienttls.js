/* --------------------------------------------------------------------------------------
   Programa que implementa um client TLS feito em NODE js

   Autor: Leonardo Bueno Nogueira Kruger
   Disciplina: Topicos de redes
   Data da ultima atualizacao: 15/04/2022
----------------------------------------------------------------------------------------*/

'use strict';

var tls = require('tls');
var fs = require('fs');
const { exit } = require('process');
const prompt = require('prompt-sync')({sigint: true});


const PORT = 1337;
const HOST = '127.0.0.1'

// Pass the certs to the server and let it know to process even unauthorized certs.
var options = {
    key: fs.readFileSync('../pem/private-key.pem'),
    cert: fs.readFileSync('../pem/public-cert.pem'),
    rejectUnauthorized: false
    
};

var client = tls.connect(PORT, HOST, options, function() {
    
    // client.enableTrace();
    console.log('\x1b[36m%s\x1b[0m',`START CONNECTION AT ${HOST}, ON PORT ${PORT}`);

    //check if authorized
    if (client.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
    } else {
        console.log('\x1b[36m%s\x1b[0m',"Connection not authorized: " + client.authorizationError)
    }
    var str = makeString();
    // Send message to server
    client.write(str);        

});

// Print data received on response
client.on("data", function(data) {

    console.log('\x1b[36m%s\x1b[0m','\nReceived: ' );
    console.log( data.toString().replace(/(\n)/gm,""));
    console.log('\x1b[36m%s\x1b[0m',`[it is ${data.length} bytes long]\n`);
    client.end();

});

// Trigger console when socket close
client.on('close', function() {
    console.log('\x1b[31m%s\x1b[0m',"Connection closed");
    exit();
});

// When an error ocoures, show it.
client.on('error', function(error) {

    console.error(error);

    // Close the connection after the error occurred.
    client.destroy();

});

// Create Json String to send and request a information
function makeString(){
    console.log("What kind of motivation do you need for today?");
    console.log("1. Motivation");
    console.log("2. Chuck noris facts");
    var value = prompt('type your choice?');
    // Send a friendly message
    return `{\"message\":\"Im the client sending you a message\",\"data\":${value}}`;
}
