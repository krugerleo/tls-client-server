
import socket
import ssl

from tls_server import HOST as SERVER_HOST
from tls_server import PORT as SERVER_PORT

HOST = "127.0.0.1"
PORT = 1338

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

client = ssl.wrap_socket(client, keyfile="../pem/private-key.pem", certfile="../pem/public-cert.pem")

if __name__ == "__main__":
    client.bind((HOST, PORT))
    client.connect((SERVER_HOST, SERVER_PORT))

    client.send("Hello World!".encode("utf-8"))
