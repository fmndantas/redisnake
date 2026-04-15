# MVP plan

## Sequence diagram

```mermaid
sequenceDiagram
    autonumber
    participant PA as Player A (Client)
    participant WS as WebSocket Server
    participant R as Redis (LIST + Pub/Sub)
    participant GE as Game Engine (Logic)
    Note over GE: [ TICK 100 Starts ]
    
    GE->>R: 1. PUBLISH "Tick 100 State"
    R-->>PA: 2. Broadcast to Client
    
    rect rgb(240, 240, 240)
        Note right of PA: Asynchronous Input Window
        PA->>WS: 3. Keypress: "RIGHT"
        WS->>R: 4. LPUSH "inputs:tick_101" {"id":"A", "dir":"R"}
        Note over R: Redis stores input in a List
    end
    Note over GE: [ TICK 101 Starts ]
    
    GE->>R: 5. LRANGE "inputs:tick_101" 0 -1
    R-->>GE: 6. Returns all inputs for this tick
    
    GE->>GE: 7. Deduplicate (Keep only last input per ID)
    GE->>GE: 8. Validate & Move Snakes
    GE->>GE: 9. Collision Detection
    
    GE->>R: 10. PUBLISH "Tick 101 State"
    GE->>R: 11. DEL "inputs:tick_101" (Cleanup)
    
    R-->>PA: 12. Broadcast to Client
```

## MVP Plan

### 1. Project Structure (Monorepo)

- `packages/shared`: Pure Logic. No I/O.
- `packages/server`: The "Heartbeat" (Bun + Redis + WebSockets).
- `packages/client`: The "View" (HTML5 Canvas + Inputs).
- `packages/tests`: Integration and Logic tests (Bun Test).

### 2. Phase 1: The Functional Domain (`shared`)

- [ ] **Define Types**: `Point`, `Direction`, `Snake`, `GameState`.
- [ ] **Movement Logic**: Pure function `move(snake, direction) -> newSnake`.
- [ ] **Collision Logic**: 
    - `checkWall(snake, gridSize) -> boolean`.
    - `checkSelf(snake) -> boolean`.
- [ ] **The Reducer**: `tick(state, inputs[]) -> nextState`.
    - Handle 180-degree turn validation.
    - Resolve movement and deaths.

### 3. Phase 2: Infrastructure & Redis (`server`)

- [ ] **Input Ingestion**: 
    - WebSocket `onMessage` -> `JSON.parse` -> `LPUSH room:1:inputs {pid, dir, tick}`.
- [ ] **The Authoritative Tick (100ms)**:
    - The following commands are suggestions and need to be validated
    - `LRANGE room:1:inputs 0 -1` to fetch all pending moves.
    - Apply `shared.tick(currentState, inputs)`.
    - `PUBLISH room:1:state {snapshot}`.
    - `DEL room:1:inputs` to clear the buffer for the next tick.
- [ ] **Connection Management**: Track active `PlayerID` and handle `ws.close` (remove snake).

### 4. Phase 3: Minimal Reactive Client (`client`)

- [ ] **Canvas Renderer**: Listen to WebSocket `message` -> Clear -> Draw all snakes.
- [ ] **Input Capture**: `keydown` -> Send `{type: 'MOVE', dir: '...'}` to Server.
- [ ] **Death Feedback**: Show "GAME OVER" if the server removes the player's ID.

### 5. Success Criteria

1. Single player can move in 4 directions.
2. High-latency simulation (Redis buffering) works without stutter.
3. Hitting the canvas boundary (Wall) triggers immediate death/reset.
