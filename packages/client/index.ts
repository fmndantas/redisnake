import { WebSocket } from 'ws';

console.log('Client is running')

const ws = new WebSocket('ws://localhost:8080');

ws.on('error', console.error);

ws.on('open', function() {
    ws.send('something');
});

ws.on('message', function message(_) {
})
