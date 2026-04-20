import { WebSocketServer } from 'ws';

import type { GameState } from './game-loop';
import { loop, speedLevel2UpdateRateInTicks } from './game-loop';

let gameState: GameState = {
    currentTick: 1,
    snakes: [
        {
            entity: {
                points: [{ x: 0, y: 0 }],
                speedLevel: 0,
                dx: 0,
                dy: 1
            },
            lastUpdatedAtTick: 0,
            updateIntervalInTicks: speedLevel2UpdateRateInTicks(0)
        }
    ]
};

console.log('Server is running (60 FPS)');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => ws.on('error', console.error));

const interval = setInterval(() => {
    gameState = loop(gameState);
    wss.clients.forEach(ws => {
        ws.send(JSON.stringify(gameState));
    });
}, 1000 / 60);

wss.on('close', () => clearInterval(interval));
