# Bridge Service

The Bridge Service acts as a real-time communication layer for the Meta The World metaverse. It facilitates interactions between clients (e.g., web frontend, game clients) and various backend services, ensuring low-latency updates and event propagation. It uses both gRPC for structured communication and WebSockets for persistent, bidirectional connections.

## Features:

- **Real-time Entity Updates**: Streams entity state changes (e.g., player positions, object interactions) to connected clients.
- **Event Subscription**: Allows clients to subscribe to world events (e.g., gambling results, zone changes).
- **gRPC Interface**: Provides a high-performance, contract-first API for core interactions.
- **WebSocket Interface**: Offers persistent connections for dynamic, event-driven communication.
- **Redis Integration**: Utilizes Redis for caching entity states and for Pub/Sub messaging to broadcast events across connected clients and services.

## Technologies:

- **Go**: Primary language for high-performance and concurrency.
- **gRPC**: For efficient inter-service communication and structured data exchange.
- **Protocol Buffers**: For defining service interfaces and message structures.
- **WebSockets (gorilla/websocket)**: For real-time, bidirectional client-server communication.
- **Redis (go-redis)**: For in-memory data store, caching, and Pub/Sub messaging.

## Service Definition (bridge.proto):

The `proto/bridge.proto` file defines the gRPC services and message types, including:

- `EntityState`: Represents the state of an entity in the world (e.g., ID, position, rotation).
- `EntityBatch`: A collection of `EntityState` objects.
- `WorldEvent`: A generic event structure for broadcasting various occurrences.
- `GamblingResult`: Specific event data for gambling outcomes.
- `BridgeService`: gRPC service with methods like `StreamEntityUpdates` and `SubscribeEvents`.

## Setup and Running:

1.  **Dependencies**: Ensure Go and Redis are installed.

2.  **Generate Protobuf Code**:
    (This step is typically handled during development, but if `bridge.pb.go` or `bridge_grpc.pb.go` are missing or need regeneration):
    ```bash
    cd services/bridge
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
    protoc --go_out=. --go_opt=paths=source_relative \
           --go-grpc_out=. --go-grpc_opt=paths=source_relative \
           proto/bridge.proto
    ```

3.  **Install Go Modules**:
    ```bash
    cd services/bridge
    go mod tidy
    ```

4.  **Run the service**:
    ```bash
    go run main.go
    ```
    The service will start and attempt to connect to Redis.