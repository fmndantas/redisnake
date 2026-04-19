import { WebSocketServer } from 'ws';

console.log('Server is running');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error)

    ws.on('message', function message(data) {
        ws.send('[server] ack -> ' + data)
    });
});
