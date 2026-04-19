import { WebSocketServer } from 'ws';

const FRAMES_PER_SECOND = 1

console.log('Server is running (%d FPS)', FRAMES_PER_SECOND);

const wss = new WebSocketServer({ port: 8080 });

interface GameState {
    currentTick: number;
};

const gameLoop = (state: GameState): GameState => {
    return { currentTick: state.currentTick + 1 };
};

let currentGameState: GameState = {
    currentTick: 1
}

wss.on('connection', ws => ws.on('error', console.error));

const interval = setInterval(() => {
    currentGameState = gameLoop(currentGameState);
    wss.clients.forEach(ws => {
        ws.send(JSON.stringify(currentGameState));
    });
}, 1000 / FRAMES_PER_SECOND);

wss.on('close', () => clearInterval(interval));
