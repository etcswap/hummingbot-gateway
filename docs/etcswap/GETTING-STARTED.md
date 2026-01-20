# ETCswap Getting Started Guide

This guide walks you through setting up Hummingbot Gateway to trade on ETCswap, the decentralized exchange on Ethereum Classic.

## Prerequisites

Before starting, ensure you have:

1. **Node.js 20+** installed
2. **pnpm** package manager (`npm install -g pnpm`)
3. **An Ethereum Classic wallet** with ETC for gas fees
4. **Tokens to trade** (e.g., WETC, USC)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/etcswap/hummingbot-gateway.git
cd hummingbot-gateway
git checkout etcswap
```

> **Note:** This uses the ETCswap fork. Once merged upstream, use `https://github.com/hummingbot/hummingbot-gateway.git`.

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Gateway Configuration
PORT=15888
LOG_LEVEL=info

# Ethereum Classic Network
ETHEREUM_CLASSIC_RPC=https://etc.rivet.link
```

### 4. Build the Project

```bash
pnpm build
```

### 5. Start the Gateway

```bash
pnpm start
```

The gateway will start on `http://localhost:15888`.

## Network Configuration

### Ethereum Classic (Mainnet)

The default configuration uses Ethereum Classic mainnet (`classic`):

| Setting | Value |
|---------|-------|
| Network | `classic` |
| Chain ID | 61 |
| Native Currency | ETC |
| RPC URL | https://etc.rivet.link |

### Mordor (Testnet)

For testing, use the Mordor testnet (`mordor`):

| Setting | Value |
|---------|-------|
| Network | `mordor` |
| Chain ID | 63 |
| Native Currency | METC |
| RPC URL | https://rpc.mordor.etccooperative.org |

## Wallet Setup

### Adding a Wallet

Use the wallet endpoints to add your wallet:

```bash
curl -X POST http://localhost:15888/wallet/add \
  -H "Content-Type: application/json" \
  -d '{
    "chain": "ethereum",
    "network": "classic",
    "privateKey": "YOUR_PRIVATE_KEY"
  }'
```

**Security Note**: Never share your private key. Use environment variables or secure key management in production.

### Verifying Wallet

Check your wallet is configured:

```bash
curl "http://localhost:15888/wallet?chain=ethereum&network=classic"
```

## Token Approvals

Before trading, you must approve tokens for the ETCswap contracts.

### Approve for Universal Router (Recommended)

The Universal Router uses Permit2 for token approvals. You need two approvals:

1. **Approve token to Permit2**:

```bash
curl -X POST http://localhost:15888/chain/approve \
  -H "Content-Type: application/json" \
  -d '{
    "chain": "ethereum",
    "network": "classic",
    "address": "YOUR_WALLET_ADDRESS",
    "spender": "etcswap/router",
    "token": "USC"
  }'
```

2. **Permit2 approval to Universal Router** (handled automatically during the first swap)

### Approve for V2 AMM

```bash
curl -X POST http://localhost:15888/chain/approve \
  -H "Content-Type: application/json" \
  -d '{
    "chain": "ethereum",
    "network": "classic",
    "address": "YOUR_WALLET_ADDRESS",
    "spender": "etcswap",
    "token": "USC"
  }'
```

### Approve for V3 CLMM

```bash
curl -X POST http://localhost:15888/chain/approve \
  -H "Content-Type: application/json" \
  -d '{
    "chain": "ethereum",
    "network": "classic",
    "address": "YOUR_WALLET_ADDRESS",
    "spender": "etcswap_lp",
    "token": "USC"
  }'
```

## Your First Trade

### Using the Universal Router (Recommended)

The Universal Router finds the best price across V2 and V3 pools.

#### Step 1: Get a Quote

```bash
curl "http://localhost:15888/connectors/etcswap/router/quote-swap?\
network=classic&\
walletAddress=YOUR_WALLET&\
baseToken=ETC&\
quoteToken=USC&\
amount=1&\
side=SELL&\
slippagePct=0.5"
```

Response:
```json
{
  "quoteId": "abc123-...",
  "tokenIn": "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a",
  "tokenOut": "0xDE093684c796204224BC081f937aa059D903c52a",
  "amountIn": 1,
  "amountOut": 15.234,
  "price": 15.234,
  "priceImpactPct": 0.05,
  "minAmountOut": 15.158,
  "maxAmountIn": 1,
  "routePath": "WETC -> USC"
}
```

#### Step 2: Execute the Quote

```bash
curl -X POST http://localhost:15888/connectors/etcswap/router/execute-quote \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "YOUR_WALLET",
    "network": "classic",
    "quoteId": "abc123-..."
  }'
```

#### Alternative: Quote and Execute in One Step

```bash
curl -X POST http://localhost:15888/connectors/etcswap/router/execute-swap \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "YOUR_WALLET",
    "network": "classic",
    "baseToken": "ETC",
    "quoteToken": "USC",
    "amount": 1,
    "side": "SELL",
    "slippagePct": 0.5
  }'
```

### Using V2 AMM Directly

For simple swaps with lower gas costs:

```bash
curl -X POST http://localhost:15888/connectors/etcswap/amm/trade \
  -H "Content-Type: application/json" \
  -d '{
    "address": "YOUR_WALLET",
    "network": "classic",
    "base": "ETC",
    "quote": "USC",
    "amount": "1",
    "side": "SELL"
  }'
```

### Using V3 CLMM Directly

For trades requiring concentrated liquidity pools:

```bash
curl -X POST http://localhost:15888/connectors/etcswap/clmm/trade \
  -H "Content-Type: application/json" \
  -d '{
    "address": "YOUR_WALLET",
    "network": "classic",
    "base": "ETC",
    "quote": "USC",
    "amount": "1",
    "side": "SELL"
  }'
```

## Common Trading Pairs

| Pair | V2 Pool | V3 Pool | Description |
|------|---------|---------|-------------|
| ETC/USC | Yes | Yes | Native ETC against Classic USD stablecoin |
| WETC/USC | Yes | Yes | Wrapped ETC against USC |

## Key Tokens

| Token | Symbol | Address | Description |
|-------|--------|---------|-------------|
| Wrapped ETC | WETC | `0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a` | Wrapped native ETC |
| Classic USD | USC | `0xDE093684c796204224BC081f937aa059D903c52a` | USD-pegged stablecoin |

## Troubleshooting

### "Token not found" Error

Ensure the token is in the gateway's token list. The token lists are located at:
- Mainnet: `src/chains/ethereum/token_lists/classic.json`
- Testnet: `src/chains/ethereum/token_lists/mordor.json`

### "Insufficient allowance" Error

You need to approve the token before trading. See [Token Approvals](#token-approvals) above.

### "Quote not found or expired" Error

Quotes expire after a short time. Request a new quote and execute it promptly.

### Transaction Reverts

Common causes:
1. **Slippage too tight**: Increase `slippagePct` (try 1-2%)
2. **Quote expired**: Request a fresh quote
3. **Insufficient balance**: Ensure you have enough tokens and ETC for gas

### Gas Estimation Failures

If gas estimation fails, the gateway uses a default gas limit of 500,000. For complex routes, you may need to increase this.

## Next Steps

- [API Reference](./API-REFERENCE.md) - Full API documentation
- [Cross-Chain Arbitrage Tutorial](./CROSS-CHAIN-ARBITRAGE.md) - Set up arbitrage between Coinbase and ETCswap
- [Contract Reference](../ETCSWAP-CONTRACTS.md) - Contract addresses and details
