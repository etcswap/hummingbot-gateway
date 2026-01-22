# ETCswap SDK Integration Report

**Date:** January 21, 2026
**Author:** Development Team
**Status:** Completed

---

## Executive Summary

This report documents the creation and integration of dedicated ETCswap SDK packages to resolve a critical `instanceof` type compatibility issue in Hummingbot Gateway. The issue arose from mixing types from multiple Uniswap SDK forks (`@uniswap/*` and `@_etcswap/*`), causing runtime type checks to fail when Pool and Pair objects were passed between different parts of the codebase.

The solution involved creating four new npm packages under the `@etcswapv2` and `@etcswapv3` organizations, then integrating them into the Gateway connector.

---

## Problem Statement

### Original Issue

The ETCswap connector in Hummingbot Gateway was experiencing `instanceof` check failures when:
- V2 `Pair` objects created with `@_etcswap/v2-sdk` were checked against `@uniswap/v2-sdk` Pair class
- V3 `Pool` objects created with `@_etcswap/v3-sdk` were checked against `@uniswap/v3-sdk` Pool class

This occurred because JavaScript's `instanceof` operator checks the prototype chain, and objects from different SDK packages (even if structurally identical) have different prototypes.

### Root Cause

The codebase was importing types from multiple sources:
- `@uniswap/sdk-core` - Core types (Token, CurrencyAmount, etc.)
- `@uniswap/v2-sdk` - V2 AMM types (Pair, Route, Trade)
- `@uniswap/v3-sdk` - V3 CLMM types (Pool, Position, etc.)
- `@_etcswap/*` - Forked SDKs with ETCswap-specific addresses

When a `Pair` object was created using `@_etcswap/v2-sdk` but later checked with `pair instanceof Pair` where `Pair` was imported from `@uniswap/v2-sdk`, the check would fail.

---

## Solution Architecture

### New SDK Packages

Four npm packages were created and published:

| Package | Version | Description | NPM |
|---------|---------|-------------|-----|
| `@etcswapv2/sdk-core` | 1.0.2 | Core types, constants, chain definitions | [Link](https://www.npmjs.com/package/@etcswapv2/sdk-core) |
| `@etcswapv2/sdk` | 1.0.2 | V2 AMM SDK (Pair, Route, Trade) | [Link](https://www.npmjs.com/package/@etcswapv2/sdk) |
| `@etcswapv3/sdk` | 1.0.2 | V3 CLMM SDK (Pool, Position, Route, Trade) | [Link](https://www.npmjs.com/package/@etcswapv3/sdk) |
| `@etcswapv3/router-sdk` | 1.0.2 | Universal Router SDK (RouterTrade, Protocol) | [Link](https://www.npmjs.com/package/@etcswapv3/router-sdk) |

### Repository Structure

The SDKs are maintained in a pnpm monorepo at: https://github.com/etcswap/sdks

```
sdks/
├── pnpm-workspace.yaml
├── package.json
├── README.md
└── sdks/
    ├── sdk-core/          # @etcswapv2/sdk-core
    │   ├── src/
    │   │   ├── constants.ts      # ChainId, addresses, INIT_CODE_HASH
    │   │   ├── entities/         # Token, CurrencyAmount, Percent, etc.
    │   │   └── index.ts
    │   └── package.json
    ├── v2-sdk/            # @etcswapv2/sdk
    │   ├── src/
    │   │   ├── constants.ts      # V2 INIT_CODE_HASH_MAP
    │   │   ├── entities/         # Pair, Route, Trade
    │   │   └── index.ts
    │   └── package.json
    ├── v3-sdk/            # @etcswapv3/sdk
    │   ├── src/
    │   │   ├── constants.ts      # FeeAmount, TICK_SPACINGS
    │   │   ├── entities/         # Pool, Position, Route, Trade
    │   │   ├── utils/            # computePoolAddress, tickMath, etc.
    │   │   └── index.ts
    │   └── package.json
    └── router-sdk/        # @etcswapv3/router-sdk
        ├── src/
        │   ├── constants.ts      # Protocol enum
        │   ├── entities/         # RouterTrade, MixedRouteSDK
        │   └── index.ts
        └── package.json
```

---

## Key Technical Details

### Chain IDs and Addresses

The SDK-core package defines ETCswap-specific chain IDs and contract addresses:

```typescript
// Chain IDs
ChainId.CLASSIC = 61   // Ethereum Classic mainnet
ChainId.MORDOR = 63    // Mordor testnet

// V2 Factory Addresses (different for each network)
V2_FACTORY_ADDRESS = {
  [ChainId.CLASSIC]: '0x0307cd3D7DA98A29e6Ed0D2137be386Ec1e4Bc9C',
  [ChainId.MORDOR]: '0x212eE1B5c8C26ff5B2c4c14CD1C54486Fe23ce70',
}

// V3 Factory Addresses (same for both networks)
V3_FACTORY_ADDRESS = {
  [ChainId.CLASSIC]: '0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC',
  [ChainId.MORDOR]: '0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC',
}
```

### V2 INIT_CODE_HASH

A critical discovery during development: ETCswap V2 uses **different INIT_CODE_HASH values** than Uniswap V2:

```typescript
// ETCswap V2 INIT_CODE_HASH (NOT the same as Uniswap V2!)
INIT_CODE_HASH_MAP = {
  [ChainId.CLASSIC]: '0xb5e58237f3a44220ffc3dfb989e53735df8fcd9df82c94b13105be8380344e52',
  [ChainId.MORDOR]: '0x4d8a51f257ed377a6ac3f829cd4226c892edbbbcb87622bcc232807b885b1303',
}

// For comparison, Uniswap V2 uses:
// '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'
```

This hash is the keccak256 of the pair contract bytecode and is essential for computing pair addresses via CREATE2.

### JSBI Version Compatibility

The Uniswap SDKs use JSBI ^3.x while our initial implementation used JSBI ^4.x. This caused TypeScript type incompatibilities because JSBI's internal structure changed between major versions.

**Resolution:** Added JSBI version resolution in Gateway's package.json:

```json
{
  "resolutions": {
    "jsbi": "^3.2.5"
  }
}
```

---

## Gateway Integration

### Files Modified

| File | Changes |
|------|---------|
| `package.json` | Added ETCswap SDK dependencies, JSBI resolution |
| `src/connectors/etcswap/etcswap.ts` | Updated imports to use `@etcswapv2/sdk-core`, `@etcswapv2/sdk`, `@etcswapv3/sdk`, `@etcswapv3/router-sdk` |
| `src/connectors/etcswap/etcswap.utils.ts` | Updated imports |
| `src/connectors/etcswap/amm-routes/quoteSwap.ts` | Updated to use `@etcswapv2/sdk-core` and `@etcswapv2/sdk` |
| `src/connectors/etcswap/amm-routes/addLiquidity.ts` | Updated to use `@etcswapv2/sdk-core` |
| `src/connectors/etcswap/clmm-routes/quoteSwap.ts` | Updated to use `@etcswapv2/sdk-core` and `@etcswapv3/sdk` |
| `src/connectors/etcswap/universal-router.ts` | Uses Uniswap SDKs for Universal Router calldata generation (ABI-compatible) |

### Import Strategy

The integration uses a **hybrid approach**:

1. **ETCswap SDKs** for all V2/V3 type definitions throughout the Gateway connector:
   - `Token`, `CurrencyAmount`, `Percent` from `@etcswapv2/sdk-core`
   - `Pair`, `Route`, `Trade` from `@etcswapv2/sdk`
   - `Pool`, `Position`, `Route`, `Trade` from `@etcswapv3/sdk`
   - `Protocol` from `@etcswapv3/router-sdk`

2. **Uniswap SDKs** specifically for Universal Router calldata generation in `universal-router.ts`:
   - The `@uniswap/universal-router-sdk` expects Uniswap's `Trade` type
   - Since the contracts are ABI-compatible, using Uniswap types for calldata generation is safe

### Dependencies Added

```json
{
  "dependencies": {
    "@etcswapv2/sdk": "^1.0.2",
    "@etcswapv2/sdk-core": "^1.0.2",
    "@etcswapv3/router-sdk": "^1.0.2",
    "@etcswapv3/sdk": "^1.0.2"
  }
}
```

---

## Publishing Issues Encountered

### Issue 1: Workspace Dependencies in Published Package

**Problem:** Initial v1.0.0 packages were published with `"@etcswapv2/sdk-core": "workspace:*"` in dependencies, which doesn't resolve when consumed from npm.

**Root Cause:** pnpm's `publish` command should convert workspace references to version numbers, but this didn't happen correctly during the initial publish.

**Resolution:**
1. Updated package.json files to bump versions to 1.0.1
2. Kept `workspace:*` for local development (pnpm converts during publish)
3. Re-published all dependent packages

### Issue 2: Missing computePoolAddress Utility

**Problem:** `@etcswapv3/sdk` was missing the `computePoolAddress` utility function needed by the Gateway.

**Resolution:** Added `computePoolAddress` to `sdks/v3-sdk/src/utils/computePoolAddress.ts`:

### Issue 3: Incorrect V3 INIT_CODE_HASH (Fixed in v1.0.2)

**Problem:** The V3 `computePoolAddress` function was using Uniswap's INIT_CODE_HASH instead of ETCswap's.

**Resolution:** Updated `computePoolAddress.ts` to use the correct ETCswap V3 INIT_CODE_HASH:
```typescript
const POOL_INIT_CODE_HASH = '0x7ea2da342810af3c5a9b47258f990aaac829fe1385a1398feb77d0126a85dbef'
```

### Issue 4: Missing @ethersproject/address Dependency (Fixed in v1.0.2)

**Problem:** `@etcswapv3/sdk` was missing `@ethersproject/address` in its dependencies, causing build failures.

**Resolution:** Added the missing dependency to v3-sdk's package.json:

```typescript
export function computePoolAddress({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  initCodeHashManualOverride,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: FeeAmount
  initCodeHashManualOverride?: string
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
  const salt = keccak256(
    ['bytes'],
    [defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])]
  )
  const initCodeHash = initCodeHashManualOverride ?? POOL_INIT_CODE_HASH
  return getCreate2Address(factoryAddress, salt, initCodeHash)
}
```

---

## Verification

### Build Status

After integration, Gateway builds successfully:

```bash
$ pnpm build
> gateway@2.11.0 build
> tsc --project tsconfig.build.json && tsc-alias -p tsconfig.build.json && pnpm run copy-files
# Completed without errors
```

### Package Verification

All packages are published and accessible on npm:

```bash
$ npm view @etcswapv2/sdk-core version
1.0.2

$ npm view @etcswapv2/sdk version
1.0.2

$ npm view @etcswapv3/sdk version
1.0.2

$ npm view @etcswapv3/router-sdk version
1.0.2
```

---

## Future Considerations

### SDK Maintenance

1. **Version Sync:** When updating SDKs, ensure all packages are updated together to maintain compatibility
2. **INIT_CODE_HASH:** If ETCswap V2 or V3 contracts are redeployed, the INIT_CODE_HASH values must be updated
3. **Universal Router:** The `universal-router.ts` uses Uniswap SDKs for calldata generation - consider creating an ETCswap Universal Router SDK if custom functionality is needed

### Testing Recommendations

1. Test V2 swap execution on Classic mainnet
2. Test V3 swap execution on Classic mainnet
3. Test Universal Router multi-hop swaps
4. Verify `instanceof` checks pass throughout the codebase
5. Test liquidity operations (add/remove) for both V2 and V3

---

## Appendix A: Contract Addresses Reference

### Ethereum Classic (Chain ID: 61)

| Contract | Address |
|----------|---------|
| V2 Factory | `0x0307cd3D7DA98A29e6Ed0D2137be386Ec1e4Bc9C` |
| V2 Router02 | `0x79Bf07555C34e68C4Ae93642d1007D7f908d60F5` |
| V3 Factory | `0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC` |
| V3 SwapRouter02 | `0xEd88EDD995b00956097bF90d39C9341BBde324d1` |
| V3 NonfungiblePositionManager | `0x3CEDe6562D6626A04d7502CC35720901999AB699` |
| V3 QuoterV2 | `0x4d8c163400CB87Cbe1bae76dBf36A09FED85d39B` |
| Universal Router | `0x9b676E761040D60C6939dcf5f582c2A4B51025F1` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |
| WETC | `0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a` |

### Mordor Testnet (Chain ID: 63)

Note: V3 contracts are the same for both Ethereum Classic and Mordor. V2 contracts are different.

| Contract | Address |
|----------|---------|
| V2 Factory | `0x212eE1B5c8C26ff5B2c4c14CD1C54486Fe23ce70` |
| V2 Router02 | `0x6d194227a9A1C11f144B35F96E6289c5602Da493` |
| V3 Factory | `0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC` |
| V3 SwapRouter02 | `0xEd88EDD995b00956097bF90d39C9341BBde324d1` |
| V3 NonfungiblePositionManager | `0x3CEDe6562D6626A04d7502CC35720901999AB699` |
| V3 QuoterV2 | `0x4d8c163400CB87Cbe1bae76dBf36A09FED85d39B` |
| Universal Router | `0x9b676E761040D60C6939dcf5f582c2A4B51025F1` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |
| WETC | `0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a` |

---

## Appendix B: INIT_CODE_HASH Values

### V2 Pair INIT_CODE_HASH

| Chain | Hash |
|-------|------|
| Classic (61) | `0xb5e58237f3a44220ffc3dfb989e53735df8fcd9df82c94b13105be8380344e52` |
| Mordor (63) | `0x4d8a51f257ed377a6ac3f829cd4226c892edbbbcb87622bcc232807b885b1303` |

### V3 Pool INIT_CODE_HASH

Note: V3 uses the same INIT_CODE_HASH for both networks.

| Chain | Hash |
|-------|------|
| All | `0x7ea2da342810af3c5a9b47258f990aaac829fe1385a1398feb77d0126a85dbef` |

---

*Report generated for internal documentation purposes. Not intended for inclusion in public PR submissions.*
