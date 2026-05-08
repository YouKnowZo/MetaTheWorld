# Technical Specification — Meta The World

**Version:** 0.1.0-draft  
**Status:** In Review  
**Last Updated:** 2024-04

---

## Table of Contents

1. [Vision and Objectives](#1-vision-and-objectives)
2. [System Architecture](#2-system-architecture)
3. [Core Components](#3-core-components)
   - 3.1 [Land Registry](#31-land-registry)
   - 3.2 [Spatial Data Pipeline](#32-spatial-data-pipeline)
   - 3.3 [World Engine](#33-world-engine)
   - 3.4 [AR/VR Interface](#34-arvr-interface)
   - 3.5 [Economic Layer](#35-economic-layer)
4. [Data Models](#4-data-models)
5. [API Contracts](#5-api-contracts)
6. [Smart Contract Specification](#6-smart-contract-specification)
7. [Tech Stack](#7-tech-stack)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Security Considerations](#9-security-considerations)
10. [Privacy and Legal](#10-privacy-and-legal)

---

## 1. Vision and Objectives

### 1.1 Vision Statement

Meta The World is a hyper-realistic, 1:1-scale digital twin of Earth. Physical geography, built environments, and live environmental data are rendered at cinematic fidelity inside Unreal Engine 5. Land parcels map directly onto real-world coordinate boundaries and are registered as ERC-721 NFTs, giving owners verifiable, permissionless title to their slice of the virtual planet.

### 1.2 Objectives

| # | Objective | Success Metric |
|---|---|---|
| O1 | 1:1 geospatial accuracy | Parcel boundaries within ±1 m of WGS-84 reference |
| O2 | Cinematic rendering quality | UE5 Nanite + Lumen at 60 fps on RTX 3080-class hardware |
| O3 | Trustless land ownership | All parcel titles stored on-chain; zero central authority |
| O4 | Live world synchronisation | Environmental state lag ≤ 5 minutes behind real-world sensors |
| O5 | Cross-platform accessibility | Playable on desktop, Meta Quest, Apple Vision Pro, HoloLens 2, iOS/Android AR |
| O6 | Open economic ecosystem | Permissionless marketplace with on-chain royalties (EIP-2981) |

### 1.3 Guiding Principles

- **Spatial Fidelity First** — real-world data is the source of truth; synthetic content must respect geodetic constraints.
- **Decentralisation by Default** — ownership, governance, and economic logic live on-chain wherever practical.
- **Progressive Immersion** — desktop browser entry-point lowers the barrier; full VR is an upgrade path, not a requirement.
- **Interoperability** — assets and identities should be portable to other EVM-compatible metaverse ecosystems.

---

## 2. System Architecture

### 2.1 High-Level Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                          Client Layer                            │
│                                                                  │
│  ┌─────────────┐  ┌────────────────┐  ┌──────────────────────┐  │
│  │ UE5 Desktop │  │  VR Headsets   │  │  AR Mobile (iOS/Android) │  │
│  └──────┬──────┘  └───────┬────────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼─────────────────────┼──────────────┘
          │                 │                       │
          │     WebSocket / gRPC / HTTPS            │
          ▼                 ▼                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                        API Gateway                               │
│              (Rate limiting · Auth · Routing)                    │
└───────────────────────────┬──────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
┌───────────────┐  ┌────────────────┐  ┌────────────────────────┐
│ Spatial       │  │ World State    │  │ Blockchain Relay        │
│ Service       │  │ Service        │  │ Service                 │
│ (Node.js/Go)  │  │ (Go)           │  │ (Node.js / ethers.js)  │
└──────┬────────┘  └──────┬─────────┘  └─────────────┬──────────┘
       │                  │                           │
       ▼                  ▼                           ▼
┌─────────────┐  ┌────────────────┐  ┌───────────────────────────┐
│ PostgreSQL  │  │ Redis (state   │  │ Polygon Network           │
│ + PostGIS   │  │ cache / pubsub)│  │ (LandRegistry.sol, etc.)  │
└─────────────┘  └────────────────┘  └───────────────────────────┘
       ▲
       │
┌──────┴─────────────────────────────────────────────────────────┐
│                    Spatial Data Pipeline                        │
│   Cesium Ion · OpenStreetMap · LiDAR Archives · Satellite      │
│   Imagery · IoT/Weather Feeds · Urban Digital Twin APIs        │
└────────────────────────────────────────────────────────────────┘
```

### 2.2 Layer Descriptions

| Layer | Responsibility |
|---|---|
| **Client Layer** | Rendering, input, XR device abstraction |
| **API Gateway** | JWT validation, rate limiting, WebSocket upgrade, service routing |
| **Spatial Service** | Parcel queries, tile serving, LOD management |
| **World State Service** | Real-time entity positions, environmental state, event broadcasting |
| **Blockchain Relay** | Transaction submission, event indexing, NFT metadata serving |
| **Data Stores** | PostGIS for geospatial data; Redis for ephemeral state; IPFS for NFT metadata |
| **Spatial Data Pipeline** | ETL jobs that ingest, process, and normalise real-world geodata |

---

## 3. Core Components

### 3.1 Land Registry

The Land Registry is the authoritative system for parcel creation, ownership, and metadata.

#### 3.1.1 Parcel Model

Each land parcel is defined by:

- **Parcel ID** — globally unique, derived from a geohash of the centroid (precision 7, ~150 m²).
- **Boundary Polygon** — GeoJSON `Polygon` in WGS-84 coordinate system, stored on PostGIS and referenced by IPFS CID on-chain.
- **Tier** — `PLOT` (≤0.1 ha), `DISTRICT` (≤1 ha), `REGION` (≤10 ha), `TERRITORY` (>10 ha).
- **Token ID** — ERC-721 token ID on the `LandRegistry` contract (Keccak-256 hash of parcel ID truncated to uint256).

#### 3.1.2 Ownership Lifecycle

```
[Unminted] → mint() → [Owned] → transfer() → [Owned by new address]
                                     ↓
                                 lease() → [Leased] → expiry → [Owned]
                                     ↓
                                 stake() → [Staked in DAO]
```

#### 3.1.3 Parcel Metadata Schema (ERC-721 / IPFS)

```json
{
  "name": "District of {{city}}, Parcel #{{id}}",
  "description": "...",
  "image": "ipfs://<rendered_thumbnail_cid>",
  "external_url": "https://metatheworld.io/land/{{id}}",
  "attributes": [
    { "trait_type": "Tier",        "value": "DISTRICT" },
    { "trait_type": "Latitude",    "value": 48.8566 },
    { "trait_type": "Longitude",   "value": 2.3522 },
    { "trait_type": "Area (ha)",   "value": 0.45 },
    { "trait_type": "Country",     "value": "France" },
    { "trait_type": "City",        "value": "Paris" },
    { "trait_type": "Biome",       "value": "Urban" }
  ]
}
```

---

### 3.2 Spatial Data Pipeline

The pipeline transforms raw geospatial data into optimised assets ready for streaming into UE5.

#### 3.2.1 Ingestion Sources

| Source | Data Type | Update Frequency |
|---|---|---|
| OpenStreetMap (Overpass API) | Building footprints, roads, POIs | Weekly diff |
| Cesium Ion | 3D tiles (photogrammetry), terrain | On-demand |
| USGS / Copernicus | LiDAR point clouds | Static + quarterly |
| Sentinel-2 / Maxar | Satellite imagery | Weekly |
| OpenWeatherMap / Tomorrow.io | Weather & atmosphere | Every 15 min |
| Urban IoT APIs (city-specific) | Traffic, air quality, noise | Every 5 min |

#### 3.2.2 Processing Steps

1. **Normalisation** — Reproject all data to WGS-84 / EPSG:4326.
2. **Segmentation** — Clip datasets to parcel and tile boundaries.
3. **LOD Generation** — Build LOD0–LOD4 meshes using PDAL (point clouds) and Blender Python API (buildings).
4. **Tile Packaging** — Output as 3D Tiles (OGC standard) consumed by Cesium for Unreal.
5. **Indexing** — Store tile manifests and parcel associations in PostGIS.
6. **CDN Push** — Upload tiles to S3-compatible object storage behind CloudFront.

#### 3.2.3 LOD Strategy

| LOD | Trigger Distance | Detail Level |
|---|---|---|
| LOD0 | < 100 m | Full photogrammetry / LiDAR density |
| LOD1 | 100–500 m | Simplified mesh, high-res texture |
| LOD2 | 500–2000 m | Baked impostor |
| LOD3 | 2000–10 km | Heightmap + satellite texture |
| LOD4 | > 10 km | Globe-level ellipsoid |

---

### 3.3 World Engine

The World Engine is the Unreal Engine 5 server-side simulation and the client-side renderer.

#### 3.3.1 Rendering Stack

- **Nanite** virtualised geometry for all LOD0/LOD1 mesh assets.
- **Lumen** hardware ray-traced global illumination and reflections.
- **World Partition** for seamless open-world streaming without level boundaries.
- **Cesium for Unreal** plugin streams 3D Tiles from the Spatial Data Pipeline into the world.
- **Temporal Super Resolution (TSR)** for upscaling on lower-end hardware.

#### 3.3.2 Server Architecture

Dedicated UE5 server instances run as containerised processes (via Pixel Streaming or custom gRPC bridge):

- **Zone Servers** — Each geographic region (≈ 50 km²) runs on one UE5 instance.
- **Session Handoff** — Players crossing zone boundaries are seamlessly handed to the adjacent server.
- **State Sync** — World State Service aggregates entity positions and broadcasts via Redis Pub/Sub.

#### 3.3.3 Physics and Simulation

- Chaos Physics for destructible buildings on owned parcels.
- Climate simulation driven by real-world weather API data (precipitation, wind, temperature).
- Day/night cycle locked to UTC and real-world sunrise/sunset times per location.

---

### 3.4 AR/VR Interface

#### 3.4.1 Supported Platforms

| Platform | Mode | SDK |
|---|---|---|
| Meta Quest 3 / Pro | Full VR | OpenXR via UE5 |
| Apple Vision Pro | Spatial Computing (visionOS) | RealityKit + Metal |
| Microsoft HoloLens 2 | AR overlay | OpenXR / Mixed Reality Toolkit |
| Desktop (Windows/macOS/Linux) | Standard 3D | UE5 direct |
| iOS / Android | Mobile AR | ARKit / ARCore via companion app |
| Web Browser | Streaming viewer | UE5 Pixel Streaming |

#### 3.4.2 Interaction Model

- **Locomotion** — Smooth, teleport, and physical walk-space modes per device.
- **Land Interaction** — Gaze + pinch (Vision Pro), hand tracking (Quest), or mouse/keyboard.
- **Building Placement** — Snap-to-grid system aligned to parcel coordinate boundaries.
- **Social Presence** — Full-body avatar with inverse kinematics driven by XR tracker data.

---

### 3.5 Economic Layer

#### 3.5.1 Token Architecture

| Token | Standard | Purpose |
|---|---|---|
| `LAND` NFT | ERC-721 | Parcel ownership title |
| `MTW` | ERC-20 | In-world utility and governance token |
| Asset NFTs | ERC-1155 | Buildings, objects, wearables |

#### 3.5.2 Revenue Flows

```
Primary Mint Revenue → Treasury (DAO-controlled)
Secondary Sale       → 5% royalty (EIP-2981) → Parcel developer fund
Lease Payments       → Landowner (configurable split with DAO)
Marketplace Fees     → 2.5% platform fee → Treasury
```

#### 3.5.3 Governance

- `MTW` token holders vote on protocol upgrades, fee parameters, and treasury allocations.
- DAO implemented via OpenZeppelin Governor + Timelock Controller.
- Staked `LAND` NFTs provide boosted voting weight proportional to parcel area.

---

## 4. Data Models

### 4.1 Parcel (PostGIS)

```sql
CREATE TABLE parcels (
    id            TEXT PRIMARY KEY,          -- geohash-derived identifier
    token_id      NUMERIC(78, 0) UNIQUE,     -- on-chain ERC-721 token ID
    owner_address TEXT,                      -- current owner wallet address
    tier          TEXT NOT NULL,             -- PLOT | DISTRICT | REGION | TERRITORY
    boundary      GEOMETRY(POLYGON, 4326) NOT NULL,
    area_ha       DOUBLE PRECISION NOT NULL,
    country_code  CHAR(2),
    city          TEXT,
    biome         TEXT,
    metadata_cid  TEXT,                      -- IPFS CID for ERC-721 metadata JSON
    minted_at     TIMESTAMPTZ,
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_parcels_boundary ON parcels USING GIST (boundary);
CREATE INDEX idx_parcels_owner    ON parcels (owner_address);
```

### 4.2 Spatial Tile Index (PostGIS)

```sql
CREATE TABLE tile_index (
    tile_key      TEXT PRIMARY KEY,          -- "{zoom}/{x}/{y}"
    lod_level     SMALLINT NOT NULL,
    s3_uri        TEXT NOT NULL,             -- s3://bucket/path/to/tile.json
    bbox          GEOMETRY(POLYGON, 4326) NOT NULL,
    last_updated  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tile_index_bbox ON tile_index USING GIST (bbox);
```

### 4.3 World Entity (Redis / in-memory)

```typescript
interface WorldEntity {
  entityId: string;        // UUID
  entityType: 'avatar' | 'vehicle' | 'object';
  ownerAddress: string;
  position: { lat: number; lon: number; altitude: number };
  rotation: { yaw: number; pitch: number; roll: number };
  zoneId: string;
  lastSeen: number;        // Unix epoch ms
}
```

---

## 5. API Contracts

### 5.1 Spatial Service REST API

```
GET  /v1/parcels?bbox={west,south,east,north}   → Parcel[]
GET  /v1/parcels/:id                             → Parcel
GET  /v1/parcels/:id/tiles                       → TileManifest
GET  /v1/tiles/{zoom}/{x}/{y}.json               → 3D Tile (proxied from CDN)
GET  /v1/weather?lat={lat}&lon={lon}             → WeatherState
```

### 5.2 World State WebSocket

```
// Client → Server
{ "type": "ENTITY_UPDATE", "payload": WorldEntity }
{ "type": "SUBSCRIBE_ZONE", "payload": { "zoneId": string } }

// Server → Client
{ "type": "ENTITY_STATE",  "payload": WorldEntity[] }
{ "type": "WORLD_EVENT",   "payload": { "event": string, "data": unknown } }
{ "type": "WEATHER_UPDATE","payload": WeatherState }
```

### 5.3 Blockchain Relay REST API

```
GET  /v1/land/:tokenId                           → LandNFTMetadata
GET  /v1/land/owner/:address                     → TokenId[]
POST /v1/land/mint                               → { txHash: string }
POST /v1/land/transfer                           → { txHash: string }
GET  /v1/land/:tokenId/history                   → TransferEvent[]
```

### 5.4 UE6 Bridge (gRPC)

The Bridge service provides high-frequency synchronization for Unreal Engine 6 clients.

**Service:** `BridgeService`

- `rpc StreamEntityUpdates(stream EntityState) returns (stream EntityBatch)`
  - Continuous stream of entity positions, rotations, and velocities.
  - Server aggregates updates and broadcasts to relevant spatial zones.
- `rpc SubscribeEvents(SubscribeRequest) returns (stream WorldEvent)`
  - Spatial subscription based on S2 Cell IDs.
  - Receives `ENTITY_UPDATE`, `WORLD_EVENT`, and `PHYGITAL_TRIGGER` events.

### 5.5 UE6 Bridge (WebSocket)

Alternative channel for event broadcasting.

- `SUBSCRIBE_ZONE`: `{ "type": "SUBSCRIBE_ZONE", "payload": { "zoneId": string } }`
- `ENTITY_STATE`: `{ "type": "ENTITY_STATE", "payload": EntityState }`

---

## 6. Smart Contract Specification

### 6.1 LandRegistry.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ILandRegistry {
    // Events
    event ParcelMinted(uint256 indexed tokenId, address indexed owner, string parcelId);
    event ParcelLeased(uint256 indexed tokenId, address indexed lessee, uint256 expiry);

    // Minting
    function mint(
        address to,
        string calldata parcelId,
        string calldata metadataCid
    ) external payable returns (uint256 tokenId);

    // Metadata
    function parcelIdOf(uint256 tokenId) external view returns (string memory);
    function tokenIdOfParcel(string calldata parcelId) external view returns (uint256);

    // Leasing
    function lease(
        uint256 tokenId,
        address lessee,
        uint256 duration
    ) external;
    function currentLessee(uint256 tokenId) external view returns (address, uint256 expiry);

    // Pricing
    function mintPrice(string calldata tier) external view returns (uint256);
}
```

### 6.2 MTWToken.sol

- ERC-20 with `ERC20Votes` extension (OpenZeppelin) for on-chain governance.
- Initial supply: 1,000,000,000 MTW (1 billion), allocated via vesting schedule.
- Emission: Land staking rewards at a governance-controlled rate.

### 6.3 AssetMarketplace.sol

- ERC-1155 receiver and escrow for Asset NFT trades.
- Implements EIP-2981 royalty hook.
- Supports both fixed-price listings and English auction mechanics.

---

## 7. Tech Stack

### 7.1 Core Technologies

| Domain | Technology | Version |
|---|---|---|
| 3D Engine | Unreal Engine 5 | 5.3+ |
| Backend Services | Node.js (TypeScript) | 20 LTS |
| High-throughput Services | Go | 1.22+ |
| Geospatial Database | PostgreSQL + PostGIS | 15 / 3.3 |
| Cache & Pub/Sub | Redis | 7.2 |
| Spatial Indexing | S2 Geometry | — |
| Communication | gRPC / WebSockets | — |
| Smart Contracts | Solidity | 0.8.24 |
| Contract Toolchain | Foundry (forge, cast, anvil) | latest |
| Blockchain Network | Polygon PoS (mainnet) / Amoy (testnet) | — |
| Decentralised Storage | IPFS via web3.storage | — |
| Spatial Data | Cesium for Unreal, Cesium Ion | 2.x |
| AR Mobile | ARKit (iOS 17+) / ARCore (Android 12+) | — |
| Container Runtime | Docker + Kubernetes | — |
| CI/CD | GitHub Actions | — |
| CDN / Object Storage | AWS CloudFront + S3 | — |

### 7.2 Key Libraries

| Library | Purpose |
|---|---|
| OpenZeppelin Contracts | ERC-721, ERC-20, Governor, Timelock |
| ethers.js v6 | Frontend / relay blockchain interaction |
| PDAL | LiDAR point cloud processing |
| GDAL | Raster and vector geospatial transforms |
| Turf.js | Server-side geospatial calculations |
| Three.js | Web-based 2D/3D parcel map viewer |
| Mapbox GL JS | 2D cartographic interface |

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric | Target |
|---|---|
| UE5 client frame rate | ≥ 60 fps (desktop), ≥ 72 fps (VR) |
| Tile load latency | < 200 ms for LOD2 and above |
| World State broadcast interval | 100 ms (10 Hz) |
| API p95 response time | < 150 ms |
| Contract transaction confirmation | < 5 s on Polygon (with EIP-1559 fast fees) |

### 8.2 Scalability

- Zone servers scale horizontally; each UE5 instance supports up to 50 concurrent players per zone.
- Spatial Service scales via stateless microservice pods behind a load balancer.
- PostGIS partitioned by geography (`country_code`) for query performance at global scale.

### 8.3 Availability

- 99.9% uptime SLA for API Gateway and Blockchain Relay.
- Multi-region active/passive failover for Spatial Service.
- UE5 zone servers may restart independently without global outage.

### 8.4 Reliability

- All blockchain interactions idempotent and retried with exponential backoff.
- Spatial data pipeline failures are non-blocking; stale tiles are served with staleness header.

---

## 9. Security Considerations

- **Smart Contracts** — All contracts audited by a third-party firm before mainnet deployment. Formal verification of `LandRegistry.sol` using Certora or Halmos.
- **Access Control** — Role-based access (`MINTER_ROLE`, `ADMIN_ROLE`) via OpenZeppelin `AccessControl`.
- **Reentrancy** — All state-changing functions follow checks-effects-interactions pattern; `ReentrancyGuard` applied to payable functions.
- **API Authentication** — JWT (RS256) issued on wallet signature (EIP-4361 Sign-In With Ethereum).
- **Rate Limiting** — API Gateway enforces per-address rate limits to prevent DoS.
- **Dependency Scanning** — Automated `npm audit` and `go mod verify` in CI.

---

## 10. Privacy and Legal

### 10.1 Real-World Mapping

- Satellite and aerial imagery sourced only from publicly licensed datasets (Copernicus Open Access, USGS EROS).
- Street-level imagery (e.g., Mapillary) used only with explicit licence; blurring applied to identifiable faces and licence plates.
- No collection or display of personally identifiable real-world data.

### 10.2 User Data

- Avatar positions are ephemeral (Redis TTL 30 s); not persisted to a permanent data store.
- Wallet addresses are pseudonymous; no KYC at the protocol layer.
- GDPR/CCPA-compliant data deletion: off-chain user preferences deleted on request within 30 days.

### 10.3 Intellectual Property

- OpenStreetMap data used under ODbL licence; attribution displayed in-world.
- Cesium Ion commercial licence required for production; terms reviewed per usage tier.
- User-generated content remains the IP of the creator; platform receives a limited licence to display and transmit.

### 10.4 Regulatory Considerations

- NFT land sales may constitute a regulated financial instrument in certain jurisdictions. Legal counsel to review prior to public mint launch.
- DAO governance tokens (`MTW`) assessed against applicable securities laws before exchange listings.

---

*For the development timeline and upcoming milestones, see [ROADMAP.md](ROADMAP.md).*
