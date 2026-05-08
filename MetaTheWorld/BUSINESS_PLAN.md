# Meta The World — Business Plan

> **Confidential** — For internal and investor use only.
> Version 1.0 | April 2026

---

## 1. Executive Summary

Meta The World (MTW) is a blockchain-native, geospatially accurate digital twin metaverse that maps every parcel of land on Earth as a tradeable NFT. Unlike competing platforms with abstract, fictional worlds, MTW is anchored to reality — users own a virtual representation of a real-world location, giving land NFTs intrinsic cultural value and scarcity that fictional grids cannot replicate.

The platform has completed its **Phase 0 Revenue Engine**, deploying five interconnected monetisation verticals: an NFT Marketplace, VIP Rooms, an Ad Space Marketplace, a Live Crypto Dashboard, and the Party Room social hub. Each vertical is backed by audited Solidity smart contracts and feeds into a central `PlatformRevenue` treasury.

**Key metrics targets (Year 2):**
- 250,000 active monthly users
- $12M ARR from platform fees
- 1,000,000 land parcels minted
- MTW token market cap: $250M

---

## 2. Problem & Solution

### The Problem

| Problem | Impact |
|---|---|
| Metaverse worlds are disconnected from reality | No intrinsic value anchor; land is purely speculative |
| Existing platforms (Decentraland, Sandbox) use grid-based fictional maps | Limited emotional connection; no cultural resonance |
| No unified revenue infrastructure for metaverse creators | Creators cannot monetise effectively; platforms lack sustainable economics |
| Virtual advertising is fragmented and untransparent | Brands cannot trust impression data; land owners earn nothing |
| Social experiences in Web3 are shallow and technical | Low retention; "check in once and leave" patterns |

### The Solution

Meta The World solves each of these with:
- **Real-world geography**: Every parcel maps to GPS coordinates via PostGIS + OpenStreetMap
- **Cultural scarcity**: Own the NFT for Times Square, the Eiffel Tower, or Shibuya Crossing
- **Revenue engine**: 5 fee-generating verticals with transparent on-chain splits
- **Transparent advertising**: Smart-contract-enforced 60/40 revenue share; IPFS-stored creatives
- **Social stickiness**: Party Room, VIP Rooms, and live events create daily return habits

---

## 3. Market Opportunity

### Total Addressable Market (TAM)

| Market | Size (2025) | CAGR |
|---|---|---|
| Global Metaverse Market | $74B | 39.8% |
| Virtual Real Estate | $5.4B | 31.2% |
| In-Game / Virtual Advertising | $14.8B | 25.1% |
| NFT Market (total) | $35B | 27.6% |
| **Combined TAM** | **~$130B** | **~30%** |

### Serviceable Addressable Market (SAM)

Focusing on crypto-native users + Web3 gaming audience:
- ~45M active crypto wallet holders globally
- ~12M active metaverse/NFT users
- **SAM: $8.5B**

### Serviceable Obtainable Market (SOM)

Realistic capture in years 1–3:
- Target 250K MAU by end of Year 2
- 2–3% of the NFT virtual real estate sub-market
- **SOM: ~$180M in cumulative GMV by Year 3**

---

## 4. Product Features (Phase 0 Complete)

### 🗺️ Map View & Land Registry
- Real-world parcel explorer backed by OpenStreetMap + PostGIS
- ERC-721 land NFTs tied to GPS coordinates
- Tier-based pricing (District, City, Country)

### 🏪 NFT Marketplace
- Buy, sell, and make offers on Land, Vehicle, Wearable, and Building NFTs
- EIP-2981 royalty auto-payment to original creators
- 2.5% platform fee on every transaction
- Mint new NFTs directly on-platform (0.05 ETH fee)

### 📈 Crypto Market Dashboard
- Live prices for 8 metaverse-relevant tokens (BTC, ETH, MATIC, SAND, MANA, AXS, ILV, ATLAS)
- MTW tokenomics overview and live USD converter
- Auto-refreshing CoinGecko integration

### 🎉 Party Room
- Free-to-enter social hub with animated dance floor
- Real-time live chat (auto-updating every 3 seconds)
- Emoji reaction overlay, DJ section with equalizer animation
- Upcoming events calendar

### 👑 VIP Rooms
- 6 exclusive rooms with on-chain entry fee enforcement
- Creator earnings: 85% of all entry fees
- Platform cut: 15% to DAO Treasury
- Users can create their own VIP room for 500 MTW

### 📣 Ad Space Marketplace
- Land owners register parcels as virtual billboards
- Advertisers book slots by duration (7 / 30 / 90 days)
- Revenue split: 60% land owner, 40% platform
- IPFS content CID stored on-chain for transparency

### 💎 Diamond District (Gaming)
- On-chain betting and gaming mechanics
- Powered by Chainlink VRF for provably fair outcomes

### 🚗 Vehicle Dealership
- Buy virtual vehicles (NFTs) with MTW tokens
- Vehicle garage and inventory management

---

## 5. Revenue Model & Projections

### Revenue Streams

| Stream | Mechanism | Platform Take |
|---|---|---|
| NFT Marketplace Fees | 2.5% of every sale | 2.5% |
| Primary Land Sales | Fixed tier pricing | 100% |
| VIP Room Entry | Per-session fee | 15% |
| Ad Space Bookings | Daily rate × duration | 40% |
| Transaction Fees | 0.1% on all MTW transfers | 100% |
| Minting Fees | 0.05 ETH per NFT minted | 100% |
| MTW Token Appreciation | Ecosystem value accrual | Indirect |

### Revenue Projections (USD)

| Year | Land Sales | NFT Marketplace | VIP Rooms | Ad Space | Tx Fees | **Total ARR** |
|---|---|---|---|---|---|---|
| Year 1 | $850K | $320K | $95K | $180K | $55K | **$1.5M** |
| Year 2 | $3.2M | $2.1M | $480K | $1.4M | $320K | **$7.5M** |
| Year 3 | $6.8M | $5.4M | $1.2M | $3.8M | $800K | **$18M** |
| Year 4 | $12.0M | $11.0M | $2.8M | $7.2M | $1.8M | **$34.8M** |
| Year 5 | $18.5M | $19.5M | $5.5M | $13.0M | $3.8M | **$60.3M** |

*Projections assume: 40% YoY user growth, stable ETH price of $3,000, MTW at $0.50 by Year 3.*

---

## 6. User Retention Strategy — The Addiction Loop

MTW is designed around a **daily engagement flywheel**:

```
 Morning  →  Check Crypto Ticker + Dashboard (price dopamine)
    ↓
 Midday   →  Browse NFT Marketplace (FOMO + discovery)
    ↓
 Evening  →  Party Room + VIP Rooms (social belonging)
    ↓
 Night    →  Check land appreciation + ad revenue (financial reward)
    ↓
 Next Day →  Repeat
```

### Retention Mechanics
- **Financial incentive**: Owning land earns ad revenue passively → users don't want to leave
- **Social FOMO**: Live user counts in Party Room create urgency
- **Status signalling**: VIP Room memberships are visible on profiles → social hierarchy
- **Economic participation**: MTW staking rewards create "skin in the game"
- **Notification hooks**: Land sold, offer received, ad campaign ended → daily re-engagement
- **Scarcity engine**: Only one NFT per real-world location → "I need to buy Paris before someone else"

---

## 7. Competitive Analysis

| Feature | **Meta The World** | Decentraland | The Sandbox | Meta Horizon | Roblox |
|---|---|---|---|---|---|
| Real-world geography | ✅ | ❌ | ❌ | ❌ | ❌ |
| Land NFTs on-chain | ✅ | ✅ | ✅ | ❌ | ❌ |
| NFT Marketplace | ✅ | ✅ | ✅ | ❌ | ❌ |
| Creator revenue share | ✅ 85% | ✅ ~97% | ✅ ~95% | ❌ | ✅ ~70% |
| Ad space marketplace | ✅ | Limited | ❌ | ❌ | ❌ |
| VIP/paid social rooms | ✅ | ❌ | ❌ | ✅ | ❌ |
| Live crypto dashboard | ✅ | ❌ | ❌ | ❌ | ❌ |
| DAO governance | ✅ | ✅ | ✅ | ❌ | ❌ |
| AR mobile app | 🔄 | ❌ | ❌ | ❌ | ❌ |
| Token | MTW | MANA | SAND | None | Robux |
| Market cap (2025) | ~$85M | ~$720M | ~$856M | $1.4T parent | $31B parent |

**Key Differentiators:**
1. **Real-world land = cultural identity** — "I own virtual Tokyo" is a stronger story than "I own parcel #4422 in Zone B"
2. **Multiple revenue verticals** — most competitors rely on primary land sales only
3. **Transparent on-chain revenue sharing** — advertisers and creators can verify every payment
4. **Lower market cap = higher upside** — significant room to grow vs. MANA/SAND

---

## 8. Go-to-Market Strategy

### Phase 1: Community Bootstrap (Months 1–6)
- Launch whitelist for early land buyers in 5 pilot cities
- Influencer program: 50 crypto / NFT influencers get free landmark parcels
- Discord community building (target: 25K members)
- Twitter/X content: daily real-world landmark → virtual parcel mapping posts

### Phase 2: NFT Drop & Marketplace Launch (Months 4–9)
- Public primary mint for first 50,000 parcels
- OpenSea & Blur listing for secondary market
- Press outreach: TechCrunch, CoinDesk, Decrypt, The Block
- Collab with existing metaverse DAOs (Decentraland DAO, ApeCoin)

### Phase 3: Brand & Enterprise Sales (Months 9–18)
- Direct sales team targeting brands for Ad Space bookings
- Enterprise package: custom VIP room + branded billboard + co-marketing
- Target: 20 enterprise clients at $50K/year average = $1M ARR

### Phase 4: Viral Growth (Months 12+)
- AR mobile app → "point your phone at the Eiffel Tower and see who owns it"
- UGC viral loop: users build on their land and share on social media
- Referral program: earn MTW for bringing in new land buyers

---

## 9. Team Requirements

| Role | Headcount | Priority |
|---|---|---|
| CTO / Lead Solidity Engineer | 1 | Critical |
| Full-Stack Web3 Developer (Next.js + wagmi) | 2 | Critical |
| Unreal Engine 5 Developer | 2 | High |
| Backend Engineer (Go / Node.js) | 2 | High |
| GIS / PostGIS Engineer | 1 | High |
| Product Manager | 1 | High |
| Head of Growth / Marketing | 1 | Medium |
| Community Manager | 1 | Medium |
| Smart Contract Auditor (contracted) | 1 | Critical |
| Legal Counsel (Web3 specialist, contracted) | 1 | High |

**Current Status:** Core engineering team of 3 in place. Seeking to expand to 12 FTE.

---

## 10. Funding Ask

### Seed Round: $3.5M

| Allocation | Amount | % |
|---|---|---|
| Engineering & Product (18 months runway) | $1.8M | 51% |
| Smart Contract Audits (2× full audits) | $300K | 9% |
| GIS Data Licensing & Infrastructure | $400K | 11% |
| Marketing & Community (Year 1) | $500K | 14% |
| Legal & Compliance | $200K | 6% |
| Operational Reserve | $300K | 9% |

**Valuation:** $18M post-money (based on comparable seed-stage Web3 projects)
**Equity offered:** ~19.4% (or structured as SAFE with $18M cap)
**Use of funds horizon:** 18 months to Series A trigger metrics

### Series A Trigger Metrics
- 100,000 MAU
- $3M ARR
- 500,000 land parcels minted
- AR mobile app live in App Store

---

## 11. Risk Analysis

| Risk | Severity | Mitigation |
|---|---|---|
| Crypto market downturn reduces NFT demand | High | Multi-revenue model reduces dependence on NFT speculation |
| Smart contract exploit / hack | Critical | Multiple audits (Certik + Trail of Bits), bug bounty program |
| Regulatory action on NFTs / crypto | High | Legal counsel, geographic revenue diversification, DAO structure |
| Competing metaverse captures market share | Medium | Real-world anchor is unique differentiator; hard to replicate |
| User acquisition cost too high | Medium | Viral AR app + land scarcity narrative reduces paid CAC |
| Polygon network congestion / migration | Low | Chain-agnostic architecture; migration path to L2 prepared |
| OpenStreetMap data quality in emerging markets | Low | Fallback to Mapbox + satellite imagery; community editing |
| Token price manipulation | Medium | Vesting schedules, liquidity locks, transparent tokenomics |

---

## 12. KPIs & Success Metrics

### North Star Metric
**Daily Active Users (DAU)** — because a metaverse only has value if people are in it every day.

### Tier 1 KPIs (Monthly Tracking)
| KPI | Year 1 Target | Year 2 Target |
|---|---|---|
| Monthly Active Users (MAU) | 25,000 | 250,000 |
| Daily Active Users (DAU) | 4,000 | 40,000 |
| Land Parcels Minted | 100,000 | 1,000,000 |
| NFT Marketplace GMV | $12.8M | $84M |
| VIP Room Entry Revenue | $630K | $3.2M |
| Ad Space Revenue | $450K | $3.5M |
| MTW Token Price | $0.15 | $0.50 |

### Tier 2 KPIs (Quarterly Tracking)
| KPI | Benchmark |
|---|---|
| DAU/MAU ratio | > 16% (industry avg: 10%) |
| Avg session duration | > 18 minutes |
| 30-day user retention | > 25% |
| NFT resale rate | > 30% of minted parcels traded within 90 days |
| Creator earnings paid out | > $1M cumulative by Month 12 |
| Smart contract TVL | > $5M locked in marketplace escrow |

---

## Appendix: Token Economics

| Allocation | Amount | % | Vesting |
|---|---|---|---|
| Community / Public Sale | 300M | 30% | 10% TGE, 36m linear |
| DAO Treasury | 200M | 20% | DAO-controlled, 48m linear |
| Team & Founders | 150M | 15% | 12m cliff, 36m linear |
| Ecosystem & Partners | 150M | 15% | 6m cliff, 24m linear |
| Advisors | 50M | 5% | 12m cliff, 24m linear |
| Liquidity Provision | 100M | 10% | 10% TGE, 12m linear |
| Reserve | 50M | 5% | DAO-controlled |
| **Total Supply** | **1,000,000,000** | **100%** | |

---

*This document was prepared by the Meta The World core team. Financial projections are forward-looking statements and are not guarantees of future performance. All figures in USD unless otherwise stated.*
