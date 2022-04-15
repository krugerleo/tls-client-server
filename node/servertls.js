'use strict';

var tls = require('tls');
var fs = require('fs');
require('./api.js')();

const PORT = 1337;
const HOST = '127.0.0.1'
const logFile = fs.createWriteStream('/server-ssl-keys.log', { flags: 'a' });

var options = {
    key: fs.readFileSync('../pem/private-key.pem'),
    cert: fs.readFileSync('../pem/public-cert.pem'),
    
};


var server = tls.createServer(options, function(socket) {

    
    // socket.enableTrace();

    // Send a friendly message
    // socket.write("I am the server sending you a message. (Connected confirmation)");

    // Print the data that we received
    socket.on('data', function(data) {
        var x = JSON.parse(data.toString());
        if(x.data == 1){
            motivation()
                .then(data => {
                    socket.write(data);
                })
                .catch(err => console.log(err))
        }else{
            quote()
                .then(data => {
                    socket.write(data.value);
                })
                .catch(err => console.log(err))
        }

        console.log('Received: %s [it is %d bytes long]',
            data.toString().replace(/(\n)/gm,""),
            data.length);

    });

    // Let us know when the transmission is over
    socket.on('end', function() {

        console.log('EOT (End Of Transmission)');

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


server.on('keylog', (line, tlsSocket) => {
    if (tlsSocket.remoteAddress !== '...')
      return; // Only log keys for a particular IP
    logFile.write(line);
});