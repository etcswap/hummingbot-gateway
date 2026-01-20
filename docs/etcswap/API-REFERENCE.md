# ETCswap API Reference

Complete API documentation for the ETCswap connector in Hummingbot Gateway.

## Base URL

```
http://localhost:15888/connectors/etcswap
```

## Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/router/quote-swap` | GET | Get optimal swap quote across V2/V3 |
| `/router/execute-quote` | POST | Execute a cached quote |
| `/router/execute-swap` | POST | Quote and execute in one step |
| `/amm/price` | POST | Get V2 AMM price |
| `/amm/trade` | POST | Execute V2 AMM trade |
| `/clmm/price` | POST | Get V3 CLMM price |
| `/clmm/trade` | POST | Execute V3 CLMM trade |
| `/clmm/add-liquidity` | POST | Add V3 liquidity position |
| `/clmm/remove-liquidity` | POST | Remove V3 liquidity position |
| `/clmm/collect-fees` | POST | Collect LP fees |
| `/clmm/position` | POST | Get position details |
| `/clmm/pool-price` | POST | Get pool price info |

---

## Universal Router Endpoints

### GET /router/quote-swap

Get an optimal swap quote that routes through V2 and/or V3 pools for best execution.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `network` | string | No | `classic` | Network name (`classic` or `mordor`) |
| `walletAddress` | string | No | Default wallet | Wallet address for the swap |
| `baseToken` | string | Yes | - | Base token symbol or address |
| `quoteToken` | string | Yes | - | Quote token symbol or address |
| `amount` | number | Yes | - | Amount to swap |
| `side` | string | Yes | - | `BUY` or `SELL` |
| `slippagePct` | number | No | 0.5 | Slippage tolerance percentage |

**Example Request:**

```bash
curl "http://localhost:15888/connectors/etcswap/router/quote-swap?\
network=classic&\
walletAddress=0x1234...&\
baseToken=ETC&\
quoteToken=USC&\
amount=1&\
side=SELL&\
slippagePct=0.5"
```

**Response:**

```json
{
  "quoteId": "550e8400-e29b-41d4-a716-446655440000",
  "tokenIn": "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a",
  "tokenOut": "0xDE093684c796204224BC081f937aa059D903c52a",
  "amountIn": 1,
  "amountOut": 15.234567,
  "price": 15.234567,
  "priceImpactPct": 0.05,
  "minAmountOut": 15.158394,
  "maxAmountIn": 1,
  "routePath": "WETC -> USC"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `quoteId` | string | Unique identifier for executing this quote |
| `tokenIn` | string | Input token address |
| `tokenOut` | string | Output token address |
| `amountIn` | number | Input amount |
| `amountOut` | number | Expected output amount |
| `price` | number | Price (quote per base) |
| `priceImpactPct` | number | Price impact percentage |
| `minAmountOut` | number | Minimum output after slippage |
| `maxAmountIn` | number | Maximum input after slippage |
| `routePath` | string | Route path description |

---

### POST /router/execute-quote

Execute a previously fetched quote.

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `walletAddress` | string | No | Default wallet | Wallet to execute from |
| `network` | string | No | `classic` | Network name |
| `quoteId` | string | Yes | - | Quote ID from quote-swap |

**Example Request:**

```bash
curl -X POST http://localhost:15888/connectors/etcswap/router/execute-quote \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234...",
    "network": "classic",
    "quoteId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Response:**

```json
{
  "signature": "0xabc123...",
  "tokenIn": "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a",
  "tokenOut": "0xDE093684c796204224BC081f937aa059D903c52a",
  "amountIn": 1,
  "amountOut": 15.234567,
  "status": 1
}
```

---

### POST /router/execute-swap

Quote and execute a swap in one step.

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `walletAddress` | string | Yes | - | Wallet address |
| `network` | string | No | `classic` | Network name |
| `baseToken` | string | Yes | - | Base token symbol or address |
| `quoteToken` | string | Yes | - | Quote token symbol or address |
| `amount` | number | Yes | - | Amount to swap |
| `side` | string | Yes | - | `BUY` or `SELL` |
| `slippagePct` | number | No | 0.5 | Slippage tolerance percentage |

**Example Request:**

```bash
curl -X POST http://localhost:15888/connectors/etcswap/router/execute-swap \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234...",
    "network": "classic",
    "baseToken": "ETC",
    "quoteToken": "USC",
    "amount": 1,
    "side": "SELL",
    "slippagePct": 0.5
  }'
```

---

## V2 AMM Endpoints

### POST /amm/price

Get price information from V2 AMM pools.

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `network` | string | No | `classic` | Network name |
| `base` | string | Yes | - | Base token symbol |
| `quote` | string | Yes | - | Quote token symbol |
| `amount` | string | Yes | - | Amount for price calculation |
| `side` | string | Yes | - | `BUY` or `SELL` |
| `allowedSlippage` | string | No | `0.5%` | Allowed slippage |

**Example Request:**

```bash
curl -X POST http://localhost:15888/connectors/etcswap/amm/price \
  -H "Content-Type: application/json" \
  -d '{
    "network": "classic",
    "base": "ETC",
    "quote": "USC",
    "amount": "1",
    "side": "SELL"
  }'
```

**Response:**

```json
{
  "network": "classic",
  "timestamp": 1705747200000,
  "latency": 150,
  "base": "ETC",
  "quote": "USC",
  "amount": "1",
  "rawAmount": "1000000000000000000",
  "expectedAmount": "15.234567",
  "price": "15.234567",
  "gasPrice": 1000000000,
  "gasPriceToken": "ETC",
  "gasLimit": 150000,
  "gasCost": "0.00015"
}
```

---

### POST /amm/trade

Execute a trade on V2 AMM pools.

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `address` | string | Yes | - | Wallet address |
| `network` | string | No | `classic` | Network name |
| `base` | string | Yes | - | Base token symbol |
| `quote` | string | Yes | - | Quote token symbol |
| `amount` | string | Yes | - | Trade amount |
| `side` | string | Yes | - | `BUY` or `SELL` |
| `allowedSlippage` | string | No | `0.5%` | Allowed slippage |

**Example Request:**

```bash
curl -X POST http://localhost:15888/connectors/etcswap/amm/trade \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x1234...",
    "network": "classic",
    "base": "ETC",
    "quote": "USC",
    "amount": "1",
    "side": "SELL"
  }'
```

**Response:**

```json
{
  "network": "classic",
  "timestamp": 1705747200000,
  "latency": 2500,
  "base": "ETC",
  "quote": "USC",
  "amount": "1",
  "rawAmount": "1000000000000000000",
  "expectedIn": "1",
  "expectedOut": "15.234567",
  "price": "15.234567",
  "gasPrice": 1000000000,
  "gasPriceToken": "ETC",
  "gasLimit": 150000,
  "gasCost": "0.00015",
  "txHash": "0xabc123..."
}
```

---

## V3 CLMM Endpoints

### POST /clmm/price

Get price information from V3 CLMM pools.

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `network` | string | No | `classic` | Network name |
| `base` | string | Yes | - | Base token symbol |
| `quote` | string | Yes | - | Quote token symbol |
| `amount` | string | Yes | - | Amount for price calculation |
| `side` | string | Yes | - | `BUY` or `SELL` |
| `fee` | string | No | Auto-detected | Fee tier (`lowest`, `low`, `medium`, `high`) |

**Fee Tiers:**

| Tier | Value | Typical Use |
|------|-------|-------------|
| `lowest` | 0.01% (100) | Stablecoin pairs |
| `low` | 0.05% (500) | Stable pairs |
| `medium` | 0.3% (3000) | Most pairs |
| `high` | 1% (10000) | Exotic pairs |

**Example Request:**

```bash
curl -X POST http://localhost:15888/connectors/etcswap/clmm/price \
  -H "Content-Type: application/json" \
  -d '{
    "network": "classic",
    "base": "ETC",
    "quote": "USC",
    "amount": "1",
    "side": "SELL",
    "fee": "medium"
  }'
```

---

### POST /clmm/trade

Execute a trade on V3 CLMM pools.

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `address` | string | Yes | - | Wallet address |
| `network` | string | No | `classic` | Network name |
| `base` | string | Yes | - | Base token symbol |
| `quote` | string | Yes | - | Quote token symbol |
| `amount` | string | Yes | - | Trade amount |
| `side` | string | Yes | - | `BUY` or `SELL` |
| `fee` | string | No | Auto-detected | Fee tier |
| `allowedSlippage` | string | No | `0.5%` | Allowed slippage |

---

### POST /clmm/add-liquidity

Add a concentrated liquidity position.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | Yes | Wallet address |
| `network` | string | No | Network name |
| `token0` | string | Yes | First token symbol |
| `token1` | string | Yes | Second token symbol |
| `fee` | string | Yes | Fee tier |
| `lowerPrice` | string | Yes | Lower price bound |
| `upperPrice` | string | Yes | Upper price bound |
| `amount0` | string | Yes | Amount of token0 |
| `amount1` | string | Yes | Amount of token1 |

**Example Request:**

```bash
curl -X POST http://localhost:15888/connectors/etcswap/clmm/add-liquidity \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x1234...",
    "network": "classic",
    "token0": "USC",
    "token1": "ETC",
    "fee": "medium",
    "lowerPrice": "10",
    "upperPrice": "20",
    "amount0": "100",
    "amount1": "5"
  }'
```

---

### POST /clmm/remove-liquidity

Remove liquidity from a position.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | Yes | Wallet address |
| `network` | string | No | Network name |
| `tokenId` | number | Yes | NFT position token ID |
| `decreasePercent` | number | No | Percentage to remove (0-100) |

---

### POST /clmm/collect-fees

Collect accumulated fees from a position.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | Yes | Wallet address |
| `network` | string | No | Network name |
| `tokenId` | number | Yes | NFT position token ID |

---

### POST /clmm/position

Get details about a liquidity position.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `network` | string | No | Network name |
| `tokenId` | number | Yes | NFT position token ID |

---

### POST /clmm/pool-price

Get current pool price and tick information.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `network` | string | No | Network name |
| `token0` | string | Yes | First token symbol |
| `token1` | string | Yes | Second token symbol |
| `fee` | string | Yes | Fee tier |

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Descriptive error message"
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters or insufficient allowance |
| 404 | Not Found - Token or quote not found |
| 500 | Internal Server Error - Unexpected error |

### Common Error Messages

| Message | Cause | Solution |
|---------|-------|----------|
| "Token not found" | Token not in token list | Add token to token list or use address |
| "Quote not found or expired" | Quote ID invalid or expired | Request a new quote |
| "Insufficient allowance" | Token not approved | Approve token for the appropriate spender |
| "Permit2 allowance expired" | Permit2 approval expired | Re-approve token using spender "etcswap/router" |
| "Slippage tolerance exceeded" | Price moved too much | Increase slippage or get fresh quote |

---

## Spender Identifiers

When approving tokens, use these spender identifiers:

| Spender | Description | Contract |
|---------|-------------|----------|
| `etcswap/router` | Universal Router (via Permit2) | Permit2 + Universal Router |
| `etcswap` | V2 Router | V2 Router contract |
| `etcswap_lp` | V3 Position Manager | NFT Position Manager |

---

## Rate Limits

The gateway does not impose rate limits, but be mindful of:
- RPC provider rate limits
- Quote expiration (quotes are cached briefly)
- Network congestion affecting transaction confirmation

---

## WebSocket Support

Currently, the ETCswap connector does not support WebSocket connections. Use polling for real-time price updates.
