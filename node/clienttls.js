'use strict';

var tls = require('tls');
var fs = require('fs');
const { exit } = require('process');
const prompt = require('prompt-sync')({sigint: true});

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

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
    // Check if the authorization worked
    console.log("CONNECTED AT %s, ON PORT %s", HOST,PORT);

    if (client.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
    } else {
        console.log("Connection not authorized: " + client.authorizationError)
    }
    // const name = prompt('What is your name?');
    // console.log(`Hey there ${name}`);

    // Send a friendly message
    var str = "I am the client sending you a message";
    var bft = Buffer.from(str);
    client.write(str);    

    // get last message sent 
    var message = client.getFinished();

    console.log('\x1b[36m%s\x1b[0m',"\nMensagem Normal:",bft); // normal
    console.log('\x1b[36m%s\x1b[0m', "Em string: ", bft.toString());
    console.log('\x1b[36m%s\x1b[0m',"\nMensagem Cripto:",message); // criptografada;
    console.log('\x1b[36m%s\x1b[0m',"Em string: ", message.toString());


});

client.on("data", function(data) {

    console.log('\nReceived: %s [it is %d bytes long]\n',
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
