# ETCswap Contract Reference

This document contains all ETCswap contract addresses and configuration details for implementing the ETCswap connector in Hummingbot Gateway.

## Implementation Scope

We are implementing ETCswap V2 (AMM) and V3 (CLMM) connectors for:
- **`classic`** - Ethereum Classic (Chain ID: 61)
- **`mordor`** - Mordor Testnet (Chain ID: 63)

---

## Ethereum Classic (`classic`)

### Network Configuration

| Field | Value |
|-------|-------|
| Config Name | `classic` |
| Network Name | Ethereum Classic |
| Default RPC URL | https://etc.rivet.link |
| Chain ID | 61 |
| Currency Symbol | ETC |
| Block Explorer URL | https://etc.blockscout.com |

### Core Tokens (Mainnet)

| Token | Symbol | Address | Decimals |
|-------|--------|---------|----------|
| Wrapped ETC | WETC | `0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a` | 18 |
| Classic USD Stablecoin | USC | `0xDE093684c796204224BC081f937aa059D903c52a` | 18 |

### ETCswap V2 Contracts (Mainnet)

| Contract | Address |
|----------|---------|
| Factory | `0x0307cd3D7DA98A29e6Ed0D2137be386Ec1e4Bc9C` |
| Router | `0x79Bf07555C34e68C4Ae93642d1007D7f908d60F5` |
| Multicall | `0xB945786D5dB40E79F1c25D937cCAC57ab3718BA1` |
| WETC/USC Liquidity Pool | `0x8B48dE7cCE180ad32A51d8aB5ab28B27c4787aaf` |

### ETCswap V3 Contracts (Mainnet)

#### Core Contracts

| Contract | Address |
|----------|---------|
| Factory | `0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC` |
| Universal Router | `0x9b676E761040D60C6939dcf5f582c2A4B51025F1` |
| Swap Router02 | `0xEd88EDD995b00956097bF90d39C9341BBde324d1` |
| Quoter V2 | `0x4d8c163400CB87Cbe1bae76dBf36A09FED85d39B` |
| Nonfungible Token Position Manager | `0x3CEDe6562D6626A04d7502CC35720901999AB699` |

#### Supporting Contracts

| Contract | Address |
|----------|---------|
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |
| Multicall V3 | `0x1E4282069e4822D5E6Fb88B2DbDE014f3E0625a9` |
| Proxy Admin | `0x4823673F7cA96A42c4E69C8953de89f4857E193D` |
| Tick Lens | `0x23B7Bab45c84fA8f68f813D844E8afD44eE8C315` |
| NFT Descriptor Library | `0xa47E8033964FbDa1cEEE77191Fc6188898355c0D` |
| Nonfungible Token Position Descriptor | `0xBCA1B20B81429cA4ca39AC38a5374A7F41Db2Ed6` |
| Descriptor Proxy | `0x224c3992F98f75314eE790DFd081017673bd0617` |
| Migrator | `0x19B067263c36FA09d06bec71B1E1236573D56C00` |
| Staker | `0x12775aAf6bD5Aca04F0cCD5969b391314868A7e9` |

#### V3 Constants (Mainnet)

| Constant | Value |
|----------|-------|
| INIT_CODE_HASH | `0x7ea2da342810af3c5a9b47258f990aaac829fe1385a1398feb77d0126a85dbef` |

---

## Mordor Testnet (`mordor`)

### Network Configuration

| Field | Value |
|-------|-------|
| Config Name | `mordor` |
| Network Name | Mordor Testnet |
| Default RPC URL | https://rpc.mordor.etccooperative.org |
| Chain ID | 63 |
| Currency Symbol | METC |
| Block Explorer URL | https://etc-mordor.blockscout.com |

### Core Tokens (Mordor)

| Token | Symbol | Address | Decimals |
|-------|--------|---------|----------|
| Wrapped ETC | WETC | `0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a` | 18 |
| Classic USD Stablecoin | USC | `0xDE093684c796204224BC081f937aa059D903c52a` | 18 |

### ETCswap V2 Contracts (Mordor)

| Contract | Address |
|----------|---------|
| Factory | `0x212eE1B5c8C26ff5B2c4c14CD1C54486Fe23ce70` |
| Router | `0x582A87594c86b204920f9e337537b5Aa1fefC07C` |
| Multicall | `0x41Fa0143ea4b4d91B41BF23d0A03ed3172725C4B` |
| WETC/USC Liquidity Pool | `0x0a73dc518791Fa8436939C8a8a08003EC782A509` |

### ETCswap V3 Contracts (Mordor)

V3 contracts on Mordor testnet use the same addresses as mainnet (classic).

| Contract | Address |
|----------|---------|
| Factory | `0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC` |
| Universal Router | `0x9b676E761040D60C6939dcf5f582c2A4B51025F1` |
| Swap Router02 | `0xEd88EDD995b00956097bF90d39C9341BBde324d1` |
| Quoter V2 | `0x4d8c163400CB87Cbe1bae76dBf36A09FED85d39B` |
| Nonfungible Token Position Manager | `0x3CEDe6562D6626A04d7502CC35720901999AB699` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |
| Tick Lens | `0x23B7Bab45c84fA8f68f813D844E8afD44eE8C315` |

---

## ETCswap Links

### V3 Resources

| Resource | URL |
|----------|-----|
| V3 Application | https://v3.etcswap.org |
| V3 Application (IPFS) | https://v3-ipfs.etcswap.org |
| V3 IPFS Hash | `bafybeifodxjubzrzsdfyy6k2s4mhna2czsbtgiivyqqsuqf7hy26r4llmu` |
| V3 Subgraph | https://v3-graph.etcswap.org/subgraphs/name/etcswap/graphql |
| V3 Analytics | https://v3-info.etcswap.org |
| V3 GeckoTerminal | https://www.geckoterminal.com/ethereum_classic/etcswap-v3/pools |

### V2 Resources

| Resource | URL |
|----------|-----|
| V2 Application | https://v2.etcswap.org |
| V2 Application (IPFS) | https://v2-ipfs.etcswap.org |
| V2 IPFS Hash | `bafybeihky5oo4jkowxpkfsywfj6axnxwqo5gkxo5ivztu3xdr6g4nzczgy` |
| V2 Subgraph | https://v2-graph.etcswap.org/subgraphs/name/etcswap/graphql |
| V2 Analytics | https://v2-info.etcswap.org |
| V2 GeckoTerminal | https://www.geckoterminal.com/ethereum_classic/etcswap-v2/pools |
| V2 Mordor Application | https://v2-mordor.etcswap.org |

### General

| Resource | URL |
|----------|-----|
| Website | https://etcswap.org |
| Twitter | https://x.com/ETCswap_org |
| Brand Assets | https://github.com/etcswap/brand |

---

## NPM Packages

ETCswap provides official npm packages for SDK integration:

| Package | Description |
|---------|-------------|
| `@_etcswap/smart-order-router` | Smart order routing for optimal swap paths across V2 and V3 |
| `@_etcswap/v2-sdk` | ETCswap V2 SDK for AMM operations |
| `@_etcswap/v3-core` | ETCswap V3 core contracts and types |
| `@_etcswap/sdk-core` | Core SDK utilities shared across V2/V3 |

### Installation

```bash
pnpm add @_etcswap/smart-order-router @_etcswap/v2-sdk @_etcswap/v3-core @_etcswap/sdk-core
```

---

## Related Projects

| Project | Address/URL |
|---------|-------------|
| ECO Reward Token | `0xc0364FB5498c17088A5B1d98F6FB3dB2Df9866a9` |
| Classic USD | https://classicusd.com |
| Ethereum Classic | https://ethereumclassic.com |
| Wrapped Ether | https://wrappedether.org |

---

## Implementation Notes

### Key Differences from Uniswap

1. **Native Asset**: ETC instead of ETH - URL paths and variable names use "ETC" instead of "ETH"
2. **Network Names**: `classic` (mainnet), `mordor` (testnet)
3. **Chain IDs**: 61 (classic), 63 (mordor)
4. **Wrapped Native Token**: WETC at `0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a`
5. **Native Currency Symbol**: ETC (classic), METC (mordor)

### Contract Compatibility

ETCswap contracts are forks of Uniswap and should be ABI-compatible:
- V2 contracts use the same interface as Uniswap V2
- V3 contracts use the same interface as Uniswap V3

### Supported Trading Types

| Type | V2 | V3 | Description |
|------|----|----|-------------|
| AMM | Yes | - | Constant product (x*y=k) pools |
| CLMM | - | Yes | Concentrated liquidity positions |
| Router | - | Yes | Universal Router for optimized swaps |

### Networks to Implement

| Network | Config Name | Chain ID | V2 | V3 |
|---------|-------------|----------|----|----|
| Ethereum Classic | `classic` | 61 | Yes | Yes |
| Mordor Testnet | `mordor` | 63 | Yes | Yes |

---

## Quick Reference: Key Contract Addresses

### Classic (Mainnet) - For Gateway Implementation

```typescript
// ETCswap V2 Classic
const ETCSWAP_V2_CLASSIC = {
  factory: '0x0307cd3D7DA98A29e6Ed0D2137be386Ec1e4Bc9C',
  router: '0x79Bf07555C34e68C4Ae93642d1007D7f908d60F5',
  multicall: '0xB945786D5dB40E79F1c25D937cCAC57ab3718BA1',
};

// ETCswap V3 Mainnet
const ETCSWAP_V3_MAINNET = {
  factory: '0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC',
  universalRouter: '0x9b676E761040D60C6939dcf5f582c2A4B51025F1',
  swapRouter02: '0xEd88EDD995b00956097bF90d39C9341BBde324d1',
  quoterV2: '0x4d8c163400CB87Cbe1bae76dBf36A09FED85d39B',
  nftPositionManager: '0x3CEDe6562D6626A04d7502CC35720901999AB699',
  permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
  tickLens: '0x23B7Bab45c84fA8f68f813D844E8afD44eE8C315',
  initCodeHash: '0x7ea2da342810af3c5a9b47258f990aaac829fe1385a1398feb77d0126a85dbef',
};

// Core Tokens Mainnet
const TOKENS_MAINNET = {
  WETC: '0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a',
  USC: '0xDE093684c796204224BC081f937aa059D903c52a',
};
```

### Mordor Testnet - For Gateway Implementation

```typescript
// ETCswap V2 Mordor
const ETCSWAP_V2_MORDOR = {
  factory: '0x212eE1B5c8C26ff5B2c4c14CD1C54486Fe23ce70',
  router: '0x582A87594c86b204920f9e337537b5Aa1fefC07C',
  multicall: '0x41Fa0143ea4b4d91B41BF23d0A03ed3172725C4B',
};

// ETCswap V3 Mordor (same addresses as classic mainnet)
const ETCSWAP_V3_MORDOR = {
  factory: '0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC',
  universalRouter: '0x9b676E761040D60C6939dcf5f582c2A4B51025F1',
  swapRouter02: '0xEd88EDD995b00956097bF90d39C9341BBde324d1',
  quoterV2: '0x4d8c163400CB87Cbe1bae76dBf36A09FED85d39B',
  nftPositionManager: '0x3CEDe6562D6626A04d7502CC35720901999AB699',
  permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
  tickLens: '0x23B7Bab45c84fA8f68f813D844E8afD44eE8C315',
  initCodeHash: '0x7ea2da342810af3c5a9b47258f990aaac829fe1385a1398feb77d0126a85dbef',
};

// Core Tokens Mordor
const TOKENS_MORDOR = {
  WETC: '0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a',
  USC: '0xDE093684c796204224BC081f937aa059D903c52a',
};
```
