# Walking Skeleton Integration Plan (Input → Redis → Server → User Feedback)

## 1) Objective

Build a minimal end-to-end flow that proves all parts work together:

1. User sends input
2. Input is buffered in Redis
3. Server processes buffered inputs on a fixed interval
4. Server sends updated result back to user

This is an integration-first skeleton, not a full product.

---

## 2) Scope (Keep It Minimal)

Include only what is required to validate the pipeline:

- One client connection
- One server instance
- One Redis instance
- One lightweight state object (e.g., a counter, position, or status)
- One input type (e.g., `increment`, `left`, `ping`)

Avoid domain complexity for now.

---

## 3) High-Level Architecture

Use this simple path:

1. **Client** sends input to server (WebSocket)
2. **Server ingress** writes input to Redis list/stream
3. **Tick loop** runs every N ms and drains queued inputs
4. **Processor** applies inputs to current in-memory state
5. **Broadcaster** sends latest state/result to client

Optional later:

- Redis Pub/Sub for fan-out
- Multi-room sharding
- Durable event history

---

## 4) Data Contracts (Small and Explicit)

Define tiny message shapes early to avoid ambiguity.

### Client → Server (input)

```json
{
  "type": "input",
  "clientId": "c1",
  "seq": 1,
  "payload": { "action": "increment" },
  "ts": 1710000000000
}
```

### Server → Client (feedback/state)

```json
{
  "type": "state",
  "tick": 42,
  "state": { "value": 10 },
  "ackSeq": 1,
  "ts": 1710000000100
}
```

Keep contracts versionable (`type`, `ts`, optional `version`).

---

## 5) Step-by-Step Implementation Plan

## Step 1 — Bootstrap workspace

Goal: Have runnable packages for shared types, server, and client.

- Create workspace structure (`packages/shared`, `packages/server`, `packages/client`)
- Add Bun scripts to run server and client
- Add base TypeScript config and path aliases

Done when:

- `bun install` works
- each package has a minimal entrypoint

## Step 2 — Start Redis locally

Goal: Confirm Redis is reachable from server.

- Run Redis (local or Docker)
- Add a tiny connectivity check in server startup

Done when:

- server logs successful Redis `PING`

## Step 3 — Add WebSocket input ingress

Goal: User input reaches server.

- Server accepts WS connections
- Client sends one input message on key press/button click
- Server validates minimal schema

Done when:

- server logs received input message with `clientId` and `seq`

## Step 4 — Buffer input in Redis

Goal: Inputs are queued externally.

- On each valid input, append to Redis queue (LIST or STREAM)
- Include `clientId`, `seq`, and payload in queue entry

Done when:

- queue length grows when user sends inputs

## Step 5 — Implement fixed tick loop

Goal: Processing cadence is deterministic.

- Start loop every 100ms (or chosen interval)
- On each tick, atomically read pending inputs and clear claimed items
- Increment `tick` counter

Done when:

- logs show stable tick progression and consumed batch size per tick

## Step 6 — Apply processing function

Goal: Inputs change state predictably.

- Create tiny pure function: `(state, inputs) -> nextState`
- For skeleton, use simple state (e.g., integer counter)
- Keep state in memory on authoritative server

Done when:

- repeated inputs produce deterministic state changes

## Step 7 — Send feedback to user

Goal: Close the loop.

- After each tick, broadcast latest state to connected client(s)
- Include `tick` and optional `ackSeq`

Done when:

- client UI visibly updates based on server state

## Step 8 — Add observability basics

Goal: Make integration debuggable.

- Structured logs for ingress, queue write, tick consume, state publish
- Add simple counters: messages in/out, queue depth, tick duration

Done when:

- failures can be localized in minutes

## Step 9 — Add one unit + one integration test

Goal: Guard core loop.

- Unit test for pure processor
- Integration test: send input → wait tick → assert feedback update

Done when:

- `bun test` passes with meaningful assertions

---

## 6) Suggested Milestones

### Milestone A — Vertical slice online

- WS connected
- input reaches server
- server echoes basic ack

### Milestone B — Redis in the middle

- input persisted in Redis queue
- tick drains queue

### Milestone C — Authoritative updates

- processing function updates state
- client receives state each tick

### Milestone D — Minimal quality bar

- logs/metrics present
- tests cover processor + end-to-end loop

---

## 7) Failure Modes to Handle Early

Keep handling simple but explicit:

- **Redis unavailable at startup**: fail fast with clear message
- **Redis temporary drop**: log + retry with backoff; avoid crash loops
- **Malformed client input**: reject and continue
- **Slow tick processing**: detect when tick duration > interval
- **Client disconnect**: cleanup connection state

---

## 8) Definition of Done (Walking Skeleton)

The skeleton is complete when all are true:

1. User action generates client input message
2. Input is queued in Redis
3. Server tick consumes queued input on interval
4. Server state changes through a deterministic processor
5. Client receives and renders feedback from server
6. One unit test + one integration test pass

---

## 9) What Not To Build Yet

Defer these until the skeleton is stable:

- complex domain rules
- auth and permissions
- horizontal scaling and multi-region concerns
- advanced reconciliation/prediction
- persistence beyond Redis queue and in-memory state

Focus first on proving the full loop works.
