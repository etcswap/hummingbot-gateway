# ETCswap SDK Type Compatibility Issue

## Error Message

```
Error getting quote: Unexpected pool type in route when constructing trade object
```

## Root Cause

The error occurs in `@_etcswap/router-sdk` when validating pool objects. The SDK checks if pools are instances of `Pool` (V3) or `Pair` (V2) using `instanceof`:

```javascript
// From @_etcswap/router-sdk/dist/router-sdk.cjs.development.js
if (pool instanceof v3Sdk.Pool) {
  poolAddressSet.add(v3Sdk.Pool.getAddress(pool.token0, pool.token1, pool.fee));
} else if (pool instanceof v2Sdk.Pair) {
  var pair = pool;
  poolAddressSet.add(v2Sdk.Pair.getAddress(pair.token0, pair.token1));
} else {
  throw new Error('Unexpected pool type in route when constructing trade object');
}
```

The `instanceof` check fails when:
1. Pool objects are created with `@uniswap/*` SDK classes
2. But `@_etcswap/router-sdk` expects `@_etcswap/*` SDK classes
3. Even though they're structurally identical, they're different class definitions

## Package Versions (vic-en's branch)

```json
"@_etcswap/sdk-core": "^4.0.10",
"@_etcswap/router-sdk": "^1.6.4",
"@_etcswap/universal-router-sdk": "^2.0.2",
"@_etcswap/v2-sdk": "^4.2.2",
"@_etcswap/v3-sdk": "^3.10.2",
"@uniswap/router-sdk": "^2.0.4",
"@uniswap/sdk-core": "^5.9.0",
"@uniswap/universal-router-sdk": "^4.19.6",
"@uniswap/v2-sdk": "^4.15.2"
```

Note: Both `@_etcswap/*` AND `@uniswap/*` packages are installed, which can cause class identity issues.

## Reproduction Steps

```bash
# Checkout vic-en's branch
git remote add vic-en https://github.com/vic-en/gateway.git
git fetch vic-en
git checkout vic-en/feat/etcSwap_connector

# Install and setup
pnpm install
pnpm run setup:with-defaults
pnpm build

# Start gateway
pnpm start --passphrase=admin --dev

# Query the router endpoint
curl "http://localhost:15888/connectors/etcSwap/router/quote-swap?network=ethereum-classic&baseToken=0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a&quoteToken=0xDE093684c796204224BC081f937aa059D903c52a&amount=1000000&side=SELL"

# Returns: {"statusCode":500,"error":"InternalServerError","message":"Unexpected pool type in route when constructing trade object"}
```

## Solution Options

### Option 1: Ensure Consistent SDK Usage

Ensure all pool/pair objects are created using `@_etcswap/*` classes, not `@uniswap/*`:

```typescript
// WRONG - creates Uniswap Pool that fails instanceof check
import { Pool } from '@uniswap/v3-sdk';
const pool = new Pool(...);

// CORRECT - creates ETCswap Pool that passes instanceof check
import { Pool } from '@_etcswap/v3-sdk';
const pool = new Pool(...);
```

### Option 2: Remove Uniswap SDK Dependencies

Remove or alias `@uniswap/*` packages to prevent accidental mixing:

```json
// package.json - use pnpm overrides
"pnpm": {
  "overrides": {
    "@uniswap/sdk-core": "npm:@_etcswap/sdk-core@^4.0.10",
    "@uniswap/v2-sdk": "npm:@_etcswap/v2-sdk@^4.2.2",
    "@uniswap/v3-sdk": "npm:@_etcswap/v3-sdk@^3.10.2"
  }
}
```

### Option 3: Create New SDKs

Create new SDK packages (`@etcswapv2/*`, `@etcswapv3/*`) that:
- Don't depend on `@uniswap/*` at all
- Have consistent internal type references
- Are properly scoped to avoid mixing

### Option 4: Duck Typing Workaround

Modify the router-sdk to use duck typing instead of `instanceof`:

```typescript
// Instead of:
if (pool instanceof Pool) { ... }

// Use:
if ('fee' in pool && 'sqrtRatioX96' in pool) { // V3 Pool
  ...
} else if ('reserve0' in pool && 'reserve1' in pool) { // V2 Pair
  ...
}
```

## Recommended Fix

**Option 1** (Ensure Consistent SDK Usage) is the cleanest fix:

1. Audit all imports in `universal-router.ts` and related files
2. Ensure only `@_etcswap/*` packages are used for pool/pair creation
3. Remove direct `@uniswap/*` dependencies if not needed by other connectors

If ETCswap SDKs have internal issues, **Option 3** (new SDKs) provides the cleanest long-term solution.

## Files Affected

- `src/connectors/etcSwap/universal-router.ts` - Main file creating pool objects
- `src/connectors/etcSwap/etcSwap.ts` - May create pool objects
- Any file importing Pool/Pair classes

---

*Captured: 2025-01-21*
