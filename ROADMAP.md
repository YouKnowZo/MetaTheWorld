# Roadmap — Meta The World

> This roadmap is a living document. Dates are targets, not guarantees. Community governance may re-prioritise items after the DAO launches in Phase 2.

---

## Status Legend

| Symbol | Meaning |
|---|---|
| ✅ | Complete |
| 🔄 | In Progress |
| 🔲 | Planned |
| ⏸ | Deferred |

---

## Phase 0 — Revenue Engine `Completed Q1 2026`

**Theme:** Monetisation infrastructure, live market data, and social/entertainment features.

Phase 0 layers a full revenue engine on top of the Genesis foundation — turning the platform into a self-sustaining economy before global rollout.

### NFT Marketplace
- ✅ `NFTMarketplace.sol` — ERC-721 & ERC-1155 listing, buying, cancellation
- ✅ On-chain offer system with ETH escrow (makeOffer / acceptOffer)
- ✅ EIP-2981 royalty auto-distribution on every sale
- ✅ 2.5% platform fee with accumulated fee withdrawal
- ✅ Frontend marketplace page — Browse, My Listings, Activity tabs
- ✅ Filter by type (Land / Vehicle / Wearable / Building) and sort options
- ✅ Mint New NFT modal with live minting state

### VIP Rooms
- ✅ `PartyRoom.sol` — on-chain room creation, entry fee collection, creator earnings
- ✅ 85% creator / 15% DAO treasury revenue split enforced on-chain
- ✅ 6 curated VIP rooms with unique perks and entry fees
- ✅ Entry fee payment modal with wallet integration
- ✅ Earnings calculator for prospective room creators
- ✅ "Create Your Own Room" CTA with setup flow

### Ad Space Marketplace
- ✅ `AdSpace.sol` — parcel-linked ad slot registration and booking
- ✅ 60% land owner / 40% platform revenue split enforced on-chain
- ✅ 48-hour cancellation window with full refund
- ✅ Overlap detection prevents double-booking
- ✅ Frontend ad marketplace — Available Slots and My Campaigns tabs
- ✅ Budget calculator with estimated impression projections

### Crypto Market Dashboard
- ✅ Live CoinGecko API integration (8 metaverse-relevant coins)
- ✅ 1h / 24h / 7d % change with colour coding
- ✅ MTW Token tokenomics display (supply, circulating, staked, treasury)
- ✅ MTW ↔ USD live converter

### Live Crypto Price Ticker
- ✅ Global ticker bar (BTC, ETH, MATIC, USDT) — visible on every page
- ✅ 30-second polling with last-known-price fallback
- ✅ Blinking LIVE indicator; green/red 24h change colouring

### Party Room
- ✅ Immersive full-screen experience with animated dance floor
- ✅ Live chat panel with auto-appending messages every 3 seconds
- ✅ Floating emoji reaction overlay
- ✅ DJ equalizer animation and now-playing display
- ✅ Upcoming events list

### Platform Treasury
- ✅ `PlatformRevenue.sol` — central treasury aggregating all revenue sources
- ✅ 4-way split: Development 30%, Marketing 20%, DAO Treasury 30%, Team 20%
- ✅ Monthly revenue reporting view function

### Navigation & Developer Experience
- ✅ Sidebar: 5 new nav items + MTW balance display
- ✅ `api-client.ts` extended with typed methods for all new features
- ✅ `Deploy.s.sol` updated to deploy all 4 new contracts

---

## Phase 1 — Genesis `Q4 2023 – Q1 2024`

**Theme:** Technical foundation, on-chain primitives, and spatial data infrastructure.

The Genesis phase establishes everything that future phases build on: a working blockchain layer, a geospatial database seeded with real-world data, and a minimal 3D viewer that proves the core tech stack is viable.

### Blockchain Layer

- 🔲 Deploy `LandRegistry.sol` (ERC-721) to Polygon Amoy testnet
- 🔲 Deploy `MTWToken.sol` (ERC-20 + ERC-20Votes) to testnet
- 🔲 Implement parcel tier pricing and mint function with fee collection
- 🔲 Write and pass full Foundry unit test suite (≥ 95% branch coverage)
- 🔲 Set up Hardhat deployment scripts and environment configuration
- 🔲 Integrate third-party audit pipeline (Slither + Aderyn static analysis in CI)

### Geospatial Infrastructure

- 🔲 Stand up PostgreSQL 15 + PostGIS 3.3 with parcel schema (see SPEC §4.1)
- 🔲 Ingest global OpenStreetMap dataset into PostGIS via `osm2pgsql`
- 🔲 Implement geohash-based parcel segmentation algorithm
- 🔲 Seed initial 10,000 parcels across 5 pilot cities (Paris, New York, Tokyo, Lagos, Sydney)
- 🔲 Build Spatial Service REST API (`GET /v1/parcels`, `GET /v1/tiles`) in Node.js/TypeScript
- 🔲 Configure Cesium Ion account and test tile streaming pipeline

### Rendering Proof-of-Concept

- 🔲 Create base UE5 5.3 project with World Partition enabled
- 🔲 Integrate Cesium for Unreal plugin; load OSM 3D tiles for a pilot city
- 🔲 Validate Nanite + Lumen pipeline with photogrammetry assets
- 🔲 Achieve ≥ 60 fps on RTX 3080 hardware at pilot city LOD0 density

### DevOps & Repository

- 🔲 Set up GitHub Actions CI (lint, test, contract checks, Docker build)
- 🔲 Create Docker Compose local development stack (Postgres, Redis, API)
- 🔲 Define and document `.env.example` with all required configuration keys
- 🔲 Establish branch protection and PR review requirements

### Deliverables

- `contracts/` — audited, tested smart contracts deployable to testnet
- `services/spatial/` — REST API serving parcel and tile data
- `ue5/MetaTheWorld.uproject` — working UE5 project with Cesium integration
- Internal demo video of pilot city rendered in UE5

---

## Phase 2 — Synthesis `Q2 2024 – Q3 2024`

**Theme:** Alpha release of the digital twin viewer, expanded geodata, and initial VR support.

Synthesis connects the on-chain registry to the 3D world, allowing NFT owners to see and interact with their parcels for the first time.

### Alpha Viewer

- 🔲 Implement World State Service (Go + Redis Pub/Sub) for real-time entity broadcasting
- 🔲 Build WebSocket client in UE5 for live entity sync (avatars, world events)
- 🔲 Launch read-only web viewer (Three.js + MapboxGL) for parcel exploration without a game client
- 🔲 Integrate Sign-In With Ethereum (EIP-4361) for wallet authentication
- 🔲 Show owned parcels highlighted on the map viewer for authenticated users

### Blockchain Integration

- 🔲 Deploy contracts to Polygon Mainnet (post-audit)
- 🔲 Launch primary mint for pilot city parcels (invite-only whitelist)
- 🔲 Implement Blockchain Relay Service for event indexing and metadata serving
- 🔲 Publish NFT metadata to IPFS via web3.storage with rendered parcel thumbnails
- 🔲 Support OpenSea and Rarible metadata standards for secondary market visibility

### Spatial Data Expansion

- 🔲 Expand parcel coverage to 50 cities globally
- 🔲 Integrate Sentinel-2 satellite imagery for terrain texture (weekly refresh)
- 🔲 Add USGS LiDAR data for 10 US metro areas (LOD0 enhancement)
- 🔲 Build automated OSM diff ingestion pipeline (weekly updates)
- 🔲 Implement CDN tile caching via CloudFront + S3 with appropriate `Cache-Control` headers

### High-Fidelity Assets

- 🔲 Commission photogrammetry scans for 3 landmark districts (Eiffel Tower area, Manhattan Midtown, Shibuya)
- 🔲 Build initial asset library: 50 architectural archetypes (residential, commercial, industrial, green space)
- 🔲 Implement in-UE5 building placement tool (snap-to-parcel-boundary grid)

### VR Support

- 🔲 Enable OpenXR plugin in UE5 project
- 🔲 Implement teleport and smooth locomotion for Meta Quest 3
- 🔲 Hand tracking for land selection and inspection
- 🔲 Internal VR alpha test with 20 external testers

### Deliverables

- Public Alpha: web viewer live at `alpha.metatheworld.io`
- Mainnet land NFT mint for whitelist holders
- UE5 Alpha build distributed to testers (Windows, Meta Quest)
- SPEC.md updated to reflect learnings from Alpha

---

## Phase 3 — Immersion `Q4 2024 – Q1 2025`

**Theme:** AR mobile application, User-Generated Content tools, and social interaction systems.

Immersion broadens the platform's reach to mobile AR and empowers landowners to actively shape their parcels.

### AR Mobile Application

- 🔲 Develop iOS companion app (ARKit + Metal) for geospatial AR overlay
- 🔲 Develop Android companion app (ARCore) feature-parity with iOS
- 🔲 AR feature: point camera at real-world location → see virtual parcel overlay with ownership info
- 🔲 AR feature: navigate to parcel boundary (AR waypoints)
- 🔲 AR feature: preview UGC buildings in real-world context
- 🔲 App Store and Google Play submission and approval

### User-Generated Content (UGC)

- 🔲 Launch in-world building editor (voxel + modular prefab hybrid system)
- 🔲 Implement asset import pipeline: GLTF/GLB → UE5 optimised mesh
- 🔲 Deploy `AssetMarketplace.sol` (ERC-1155 + EIP-2981) to mainnet
- 🔲 Creator revenue dashboard: real-time royalty earnings and sales analytics
- 🔲 Content moderation pipeline (automated CSAM/IP scanning + human review queue)

### Social Systems

- 🔲 Avatar customisation system (body, face, clothing as ERC-1155 wearables)
- 🔲 Voice chat via WebRTC (proximity-based spatial audio)
- 🔲 Text chat with parcel-scoped channels
- 🔲 Emotes and gesture system driven by IK
- 🔲 Social graph: follow, friend, and block functionality (off-chain, GDPR-compliant)
- 🔲 In-world events system: landowners can schedule public or private events on their parcel

### Leasing and Rental

- 🔲 Implement `lease()` function on `LandRegistry.sol` with on-chain enforcement
- 🔲 Build lease management UI for landowners (duration, price, lessee allow-list)
- 🔲 Automated rent payment in `MTW` tokens via recurring Gelato Network task

### Performance and Scale

- 🔲 Kubernetes cluster deployment for all backend services
- 🔲 Auto-scaling UE5 zone servers on AWS Gamelift or Agones (GKE)
- 🔲 Load test to 1,000 concurrent users across 20 zone servers
- 🔲 UE5 Pixel Streaming deployment for browser-based access (no install required)

### Deliverables

- iOS and Android AR apps in production stores
- UGC building tools in Beta for all landowners
- Social features live in public Beta
- Scale validated to 1,000 CCU

---

## Phase 4 — Symmetry `Q2 2025+`

**Theme:** Real-time IoT integration, AI-driven environment, global economic scaling, and ecosystem interoperability.

Symmetry realises the full "hyper-real digital twin" vision: a living, breathing world that mirrors Earth in real-time and has a thriving, self-sustaining economy.

### Real-Time Digital Twin

- 🔲 IoT data integration: ingest live traffic feeds (HERE API) → animate vehicles in-world
- 🔲 IoT data integration: air quality sensors → visual atmosphere adjustment (smog, clarity)
- 🔲 IoT data integration: real-time weather (Tomorrow.io) → precipitation, wind, lighting changes
- 🔲 Live sports and event data → in-world crowd simulation at stadiums
- 🔲 Emergency services feed → in-world visual alerts on affected parcels
- 🔲 Sub-5-minute world state lag from real-world events to in-world representation

### AI-Driven Environment

- 🔲 Procedural NPC population: AI agents fill city streets with realistic pedestrian behaviour
- 🔲 AI-powered parcel development suggestions for landowners (based on neighbouring land use)
- 🔲 Generative texture and asset variation system (reduce visual repetition at scale)
- 🔲 AI moderation assistant for UGC content review queue

### Global Coverage

- 🔲 Full global parcel generation (all land area on Earth segmented and available for mint)
- 🔲 LiDAR coverage expansion to 50+ cities worldwide
- 🔲 Photogrammetry coverage for 100 global landmarks
- 🔲 Localisation: in-world UI and web app in 10 languages

### DAO and Governance

- 🔲 Deploy `MTWGovernor.sol` (OpenZeppelin Governor + Timelock) to mainnet
- 🔲 First on-chain governance vote: protocol fee parameters
- 🔲 Treasury dashboard: public real-time view of DAO holdings and expenditure
- 🔲 Grant programme: DAO-funded developer grants for ecosystem tooling
- 🔲 Staking rewards live: MTW emissions to LAND NFT stakers

### Interoperability

- 🔲 ERC-6551 Token Bound Accounts for LAND NFTs (parcels as autonomous on-chain agents)
- 🔲 Cross-metaverse avatar portability (VRM standard import/export)
- 🔲 Wearables interoperability with Decentraland and The Sandbox asset standards
- 🔲 Chainlink CCIP bridge: MTW token bridged to Ethereum mainnet and Base

### Apple Vision Pro

- 🔲 Native visionOS application using RealityKit + SwiftUI
- 🔲 Spatial window: floating 3D parcel map in passthrough mode
- 🔲 Full immersive scene mode for owned parcels
- 🔲 SharePlay integration: shared spatial experience for multiple Vision Pro users

### Deliverables

- Full global parcel availability (public mint open)
- DAO governance live with community voting
- Real-time IoT world synchronisation for 20+ cities
- Vision Pro app in App Store
- Cross-metaverse asset interoperability documented and live

---

## Backlog / Future Considerations

Items under active research but not yet scheduled:

| Item | Notes |
|---|---|
| Decentralised zone servers (DePIN) | Community-run UE5 servers rewarded in MTW |
| On-chain parcel zoning rules | DAO-governed land use regulations encoded in smart contracts |
| Physical-world integration events | QR/NFC codes in real-world locations unlock in-world rewards |
| Haptic feedback SDK | Partner with bHaptics / Immersion for tactile world interaction |
| Satellite live feeds | Near-real-time satellite imagery refreshed hourly (commercial licence required) |
| Photovoltaic/energy simulation | Model real-world solar and wind energy on parcels |

---

## Milestone Summary

| Milestone | Target | Phase |
|---|---|---|
| Testnet contracts deployed | Q4 2023 | Genesis |
| Pilot city UE5 POC | Q4 2023 | Genesis |
| REST API v1 live | Q1 2024 | Genesis |
| Mainnet mint launch | Q2 2024 | Synthesis |
| Public alpha (web viewer) | Q2 2024 | Synthesis |
| UE5 alpha (50 cities) | Q3 2024 | Synthesis |
| AR mobile apps shipped | Q4 2024 | Immersion |
| UGC building tools beta | Q4 2024 | Immersion |
| 1,000 CCU load test passed | Q1 2025 | Immersion |
| Global parcel coverage | Q2 2025 | Symmetry |
| DAO governance live | Q3 2025 | Symmetry |
| Real-time IoT integration | Q3 2025 | Symmetry |
| Vision Pro app | Q4 2025 | Symmetry |

---

*For technical details on each component, see [SPEC.md](SPEC.md).*  
*To report bugs or request features, open a GitHub Issue.*
