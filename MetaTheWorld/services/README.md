# Services Overview

This directory contains the backend services that power the Meta The World metaverse. Each service is designed to handle specific functionalities and can be developed and deployed independently.

## Services:

- [**AI Agent Service**](./ai-agent/README.md): Manages AI-driven agents within the metaverse for interactions, patrols, and reporting.
- [**Bridge Service**](./bridge/README.md): Facilitates real-time communication between clients and the backend, handling gRPC and WebSocket connections for entity updates and events.
- [**Spatial Service**](./spatial/README.md): Manages all spatial data, including parcels, their ownership, and geographic queries within the metaverse.

Each service subdirectory contains a more detailed `README.md` explaining its purpose, setup, and API.