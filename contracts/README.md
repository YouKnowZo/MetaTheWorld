## Meta The World Smart Contracts

This directory contains all the Solidity smart contracts for the Meta The World metaverse. These contracts define the core logic for digital assets, ownership, marketplace functionalities, governance, and in-game mechanics.

### Contract List

- **[AdSpace.sol](src/AdSpace.sol)**: Manages the listing, rental, and cancellation of in-world advertising spaces. Integrates with ERC-721 for parcel ownership.
- **[DiamondDistrict.sol](src/DiamondDistrict.sol)**: Implements the core logic for the Diamond District, potentially including gambling games or other interactive experiences.
- **[LandRegistry.sol](src/LandRegistry.sol)**: A registry for virtual land parcels (ERC-721 NFTs), tracking ownership and metadata.
- **[MTWToken.sol](src/MTWToken.sol)**: The primary ERC-20 utility token for the Meta The World ecosystem.
- **[NFTMarketplace.sol](src/NFTMarketplace.sol)**: Facilitates the buying, selling, and listing of various NFTs (ERC-721 and ERC-1155) within the metaverse, including royalties.
- **[PartyRoom.sol](src/PartyRoom.sol)**: Manages party room functionalities, such as creation, access control, and potentially event scheduling.
- **[PlatformRevenue.sol](src/PlatformRevenue.sol)**: Handles the collection and distribution of platform fees and revenues generated within the metaverse.
- **[RoyaltyDistributor.sol](src/RoyaltyDistributor.sol)**: Manages the distribution of royalties to creators for NFT sales.
- **[VehicleDealership.sol](src/VehicleDealership.sol)**: Manages the listing and sale of in-world vehicles. Integrates with the MTW Token for purchases.
- **[VehicleParts.sol](src/VehicleParts.sol)**: Potentially an ERC-1155 contract for managing modular vehicle parts as NFTs.
- **[VehicleRegistry.sol](src/VehicleRegistry.sol)**: A registry for in-world vehicles, tracking ownership and vehicle-specific data.
- **[ZoningRegistry.sol](src/ZoningRegistry.sol)**: Defines and manages zoning regulations or types for different areas of the metaverse.
- **[MTWGovernor.sol](src/governance/MTWGovernor.sol)**: Implements the governance mechanism for the MTW DAO, allowing token holders to propose and vote on changes.
- **[MTWTimelock.sol](src/governance/MTWTimelock.sol)**: A timelock contract used in conjunction with the governor to enforce a delay before executing approved proposals.
- **[ILandRegistry.sol](src/interfaces/ILandRegistry.sol)**: Interface definition for the LandRegistry contract, used for contract-to-contract interaction.

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
