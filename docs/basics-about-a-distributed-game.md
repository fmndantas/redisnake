# Basics acout a distributed game 

## Authoritative Server Model

- Principle: The server is the single source of truth; clients only send "intents" (inputs), never their own state (positions).
- The Tick: The atomic unit of time (e.g., 10Hz/100ms). All physics and logic resolve synchronously on the tick.

## Input Handling & Buffering

- Asynchronous Ingress: Inputs arrive at any time and are buffered into "Tick Buckets" (e.g., Redis `LIST` per tick ID).
- Validation: The server validates inputs (e.g., no 180° turns) before applying them to the next state.
- Late Inputs: Packets arriving after their target tick are either dropped or applied to the current/next available tick (Best Effort).

## State Synchronization

- Delta Compression: Only broadcast what *changed* (e.g., New Head, Removed Tail) to save bandwidth.
- Pub/Sub: Use Redis Pub/Sub to decouple the game engine logic from WebSocket/API connection handlers.

## Concurrency & Atomicity

- Atomic Operations: Use Lua scripts in Redis if scaling horizontally to ensure check-and-set operations (like collision detection) are atomic.
- Single-Server Trade-off: Running state in-memory on a single server is faster (low latency) but limits horizontal scaling and fault tolerance.

## Testing Patterns

- Headless Bots: Use automated scripts to simulate hundreds of players to test load and tick consistency.
- Deterministic Replay: Log all inputs to replay sessions exactly, ensuring the game logic is predictable.
- Chaos Engineering: Deliberately inject latency/packet loss to test "Rubber-banding" and reconciliation logic.
