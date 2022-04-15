/* --------------------------------------------------------------------------------------
   Programa que implementa um servidor TLS feito em NODE js

   Autor: Leonardo Bueno Nogueira Kruger
   Disciplina: Topicos de redes
   Data da ultima atualizacao: 15/04/2022
----------------------------------------------------------------------------------------*/


'use strict';

// Imports
var tls = require('tls');
var fs = require('fs');
require('./api.js')();

// Consts
const PORT = 1337;
const HOST = '127.0.0.1'

// Options for tls server
var options = {
    key: fs.readFileSync('../pem/private-key.pem'),
    cert: fs.readFileSync('../pem/public-cert.pem'),
    
};


var server = tls.createServer(options, function(socket) {

    
    socket.enableTrace();
    console.log('\x1b[31m%s\x1b[0m',"NEW CONNECTION");
    //Check if socket is authorized
    if (socket.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
    } else {
        // if not print the authorizationError
        console.log('\x1b[36m%s\x1b[0m',"Connection not authorized: ", socket.authorizationError)
    }

    // distinguish TLS sockets from regular net.Socket instances.
    if(socket.encrypted){
        console.log('\x1b[36m%s\x1b[0m',"This is a encrypted TLS Socket instance");
    }else{
        console.log('\x1b[36m%s\x1b[0m',"This is a regular net.Socket instance");
    }

    // On receive make a response and print received
    socket.on('data', function(data) {
        try {
            var x = JSON.parse(data.toString());
            if(x.data == 1){
                motivation()
                    .then(data => {
                        socket.write(data);
                    })
                    .catch(err => console.log(err))
            }else if(x.data == 2){
                quote()
                    .then(data => {
                        socket.write(data.value);
                    })
                    .catch(err => console.log(err))
            }else{
                socket.write("Selected option is invalid");    
            }    
        } catch (error) {
            socket.write("Error generating a response");
        }
        
        // Print received data
        console.log('Received: %s [it is %d bytes long]',
            data.toString().replace(/(\n)/gm,""),
            data.length);

    });

    // Print EOT when connection is closed
    socket.on('end', function() {

        console.log('\x1b[31m%s\x1b[0m','EOT (End Of Transmission)\n');

    });

});

// Start listening on a specific port and address
server.listen(PORT, HOST, function() {

    console.log("I'm listening at %s, on port %s", HOST, PORT);

});

// When an error occurs, show it.
server.on('error', function(error) {

    console.error(error);

    // Close the connection after the error occurred.
    server.destroy();

});
