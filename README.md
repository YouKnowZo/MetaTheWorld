# Meta The World

> A hyper-realistic digital twin metaverse with NFT-based land ownership — where the physical world and the digital universe converge.

---

## Overview

**Meta The World** is an open, persistent, and geospatially accurate digital twin of Earth. It fuses photorealistic real-world data (LiDAR, satellite imagery, and GIS) with Unreal Engine 5 rendering, letting users own, build on, and monetise parcels of virtual land represented as NFTs on an EVM-compatible blockchain.

The platform is built around three core pillars:

| Pillar | Description |
|---|---|
| 🌍 **Hyper-Realism** | Nanite geometry, Lumen global illumination, and real-world GIS/LiDAR data produce a 1:1 replica of Earth at cinematic fidelity. |
| 🔗 **Digital Twin** | Live feeds from IoT sensors, weather APIs, and urban datasets keep the virtual world continuously synchronised with its physical counterpart. |
| 🏛️ **Blockchain Ownership** | Every land parcel is a unique ERC-721 NFT on Polygon, providing transparent, permissionless, and interoperable ownership. |
| 🌉 **UE6 Bridge** | High-performance gRPC/WebSocket synchronization layer for real-time spatial state and "Phygital" events. |

---

## Core Features

- **Geospatial Land Registry** — Parcel boundaries derived from real-world coordinates (WGS-84), minted as on-chain NFTs.
- **Spatial Data Streaming** — Adaptive LOD pipeline powered by Cesium for Unreal and OpenStreetMap tiles.
- **AR/VR Interface** — Native support for Meta Quest, Apple Vision Pro, HoloLens 2, and desktop VR headsets.
- **User-Generated Content** — In-world building tools with asset marketplace and royalty engine.
- **Real-Time IoT Sync** — Weather, traffic, and environmental sensor data reflected in the live world state.
- **Economic Layer** — Decentralised land marketplace, rental contracts, and governance via DAO.

---

## Getting Started

> The project is currently in the **Genesis** phase. Infrastructure and smart contracts are under active development. See the [Roadmap](ROADMAP.md) for progress details.

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Unreal Engine 5 | 5.3 |
| Node.js | 20 LTS |
| Go | 1.22 |
| PostgreSQL + PostGIS | 15 / 3.3 |
| Foundry (Solidity) | latest |

### Quick Start

```bash
# Clone the repository
git clone https://github.com/YouKnowZo/Meta_The_World.git
cd Meta_The_World

# Install backend dependencies
cd services && npm install

# Install frontend dependencies
cd ../apps/web && npm install

# Copy environment template
cd ../..
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local

# Start local development stack (Docker required)
docker compose up -d

# Deploy contracts to local Hardhat node
cd contracts && npx hardhat node &
npx hardhat run scripts/deploy.ts --network localhost
```

Full setup instructions will be added to `docs/SETUP.md` as each phase completes.

---

## Documentation

| Document | Description |
|---|---|
| [SPEC.md](SPEC.md) | Full technical specification — architecture, components, data models, and APIs |
| [ROADMAP.md](ROADMAP.md) | Phased development roadmap with milestones and deliverables |

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────┐
│                    Client Layer                      │
│        UE5 Desktop · VR Headsets · AR Mobile         │
└───────────────────────┬─────────────────────────────┘
                        │ WebSocket / gRPC
┌───────────────────────▼─────────────────────────────┐
│                  World Engine (UE5)                  │
│      Nanite · Lumen · Cesium · Chaos Physics         │
└──────────┬────────────────────────┬─────────────────┘
           │ REST / GraphQL          │ Event Stream
┌──────────▼──────────┐  ┌──────────▼──────────────── ┐
│   Spatial Services  │  │   Blockchain Layer          │
│  Node.js · PostGIS  │  │  Solidity · Polygon · IPFS  │
└──────────┬──────────┘  └────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────┐
│              Spatial Data Pipeline                   │
│   Cesium Ion · OSM · LiDAR · Satellite · IoT Feeds  │
└─────────────────────────────────────────────────────┘
```

---

## Contributing

Contributions are welcome once the Genesis phase scaffolding is in place. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

[MIT](LICENSE)

---

## New Features (Phase 0) 🚀

The following features were implemented as part of the **Phase 0 Revenue Engine**, transforming the platform into a multi-vertical monetisation powerhouse.

### 🏪 NFT Marketplace
A full-featured secondary market for all MTW assets.
- Browse, filter, and sort Land, Vehicle, Wearable, and Building NFTs
- Make offers with ETH escrow; sellers can accept at any time
- **EIP-2981 royalty auto-payment** — creators earn on every secondary sale
- **2.5% platform fee** collected on all transactions
- Mint new NFTs directly via on-platform modal (0.05 ETH fee)
- Backed by `NFTMarketplace.sol` — fully auditable Solidity 0.8.24 contract

### 📈 Crypto Market Dashboard
Real-time market data for metaverse-native investors.
- Live prices for 8 tokens: BTC, ETH, MATIC, SAND, MANA, AXS, ILV, ATLAS
- 1h / 24h / 7d percentage change with colour coding
- MTW Token tokenomics panel (supply, circulating, staked, treasury)
- Built-in **MTW ↔ USD converter**
- Manual refresh + auto-loading via CoinGecko public API

### 💹 Live Crypto Price Ticker
Always-visible market pulse at the top of every page.
- Scrolling ticker for BTC, ETH, MATIC, USDT with live prices
- Blinking 🟢 LIVE indicator
- 30-second polling with last-known-price fallback on API errors
- Injected globally in `layout.tsx` — zero configuration required

### 🎉 Party Room
Immersive, free-to-enter social experience.
- Full-screen animated dance floor with 20 bouncing avatar circles
- **Live chat panel** with auto-appending messages every 3 seconds
- Floating emoji reaction overlay (click to launch floating emojis)
- Animated DJ equalizer with now-playing track display
- Room stats bar: Active / Dancing / Chatting / Watching
- Upcoming events calendar with entry prices

### 👑 VIP Rooms
Exclusive paid social spaces with on-chain enforcement.
- 6 curated rooms: The Penthouse, Crypto Whales Lounge, Genesis Founders Club, NFT Elite Gallery, Diamond Vault, Metaverse Summit
- Entry fees from 50 MTW to 1,000 MTW — enforced by `PartyRoom.sol`
- **85% revenue to room creator / 15% to DAO Treasury** — verified on-chain
- Entry fee payment modal with wallet integration
- Earnings calculator for prospective room hosts
- Create your own VIP room for 500 MTW setup fee

### 📣 Ad Space Marketplace
The metaverse's first transparent virtual billboard market.
- 6 premium locations: Paris, NYC, Tokyo, Dubai, London, Sydney
- Book by duration: 7 / 30 / 90 days
- **60% revenue to land owner / 40% to platform** — enforced by `AdSpace.sol`
- Overlap detection prevents double-booking
- 48-hour cancellation window with full refund
- Budget calculator with estimated impression projections
- Campaign submission form with multi-location selection

### ⛓️ New Smart Contracts

| Contract | Purpose | Key Feature |
|---|---|---|
| `NFTMarketplace.sol` | ERC-721 & ERC-1155 marketplace | EIP-2981 royalties, offer escrow |
| `PartyRoom.sol` | VIP room access control | 85/15 revenue split |
| `AdSpace.sol` | Virtual billboard booking | 60/40 revenue split, overlap check |
| `PlatformRevenue.sol` | Central treasury aggregator | 4-way split: Dev/Mktg/DAO/Team |

### 🧭 Updated Navigation
- Sidebar now includes: NFT Marketplace, Crypto Prices, Party Room, VIP Rooms, Ad Space
- **MTW Balance** widget in sidebar with gold coin icon and USD equivalent
- All new pages wrapped in consistent dark dashboard layout

---

## Quick Start

```bash
# Install dependencies
cd apps/web && npm install

# Run development server
npm run dev

# Open in browser
open http://localhost:3000
```

## Contract Deployment

```bash
cd contracts
forge build
forge script script/Deploy.s.sol --broadcast --rpc-url $RPC_URL
```

---

*See [BUSINESS_PLAN.md](BUSINESS_PLAN.md) for revenue projections and investor information.*
*See [ROADMAP.md](ROADMAP.md) for the complete development timeline.*
