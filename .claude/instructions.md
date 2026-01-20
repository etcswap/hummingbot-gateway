# Hummingbot Gateway Development Instructions

Instructions for AI coding assistants working on Hummingbot Gateway (hummingbot-gateway).

## Project Vision

Hummingbot Gateway is a **TypeScript-based API middleware** that provides standardized endpoints for blockchain and DEX interactions. It serves as the bridge between the Hummingbot trading bot (Python) and decentralized exchanges.

**Current Focus:** Adding ETCswap V2 and V3 connectors for Ethereum Classic (`classic` mainnet and `mordor` testnet).

**Key Reference:** See [docs/ETCSWAP-CONTRACTS.md](../docs/ETCSWAP-CONTRACTS.md) for all ETCswap contract addresses.

## Tech Stack

**Framework & Runtime:**
- Node.js: 20.x+ required
- TypeScript: 5.x (ESNext target, CommonJS modules)
- Fastify: Web framework with TypeBox schema validation
- pnpm: Package manager

**Blockchain:**
- ethers.js: Ethereum interactions
- @solana/web3.js: Solana interactions
- viem: Some EVM utilities

**Testing:**
- Jest: Test framework
- Minimum 75% coverage for PRs

## Quick Start

```bash
# Install dependencies
pnpm install

# Initial setup (interactive)
pnpm run setup

# Setup with defaults
pnpm run setup:with-defaults

# Start in dev mode (HTTP, no SSL)
pnpm start --passphrase=<PASSPHRASE> --dev

# Start in production mode (HTTPS)
pnpm start --passphrase=<PASSPHRASE>

# Validation (run before committing)
pnpm lint          # ESLint check
pnpm typecheck     # TypeScript check
pnpm build         # Build project
pnpm test          # Run tests
```

**All validation commands must pass before changes can be committed.**

## Core Architecture Patterns

### 1. Gateway Pattern

- RESTful API providing standardized endpoints
- Built with Fastify using TypeBox for schema validation
- Supports HTTP (dev) and HTTPS (production) modes
- Swagger docs at `/docs` (http://localhost:15888/docs in dev mode)
- Global rate limiting (100 requests/minute)

### 2. Module Organization

**Chains** (`src/chains/`):
- Blockchain implementations (Ethereum, Solana)
- Each chain implements: balances, tokens, status, allowances
- Singleton pattern with `getInstance(network)`

**Connectors** (`src/connectors/`):
- DEX protocol implementations
- Three trading types:
  - **Router**: DEX aggregators (Jupiter, 0x, Uniswap Universal Router)
  - **AMM**: V2-style constant product pools (Uniswap V2, Raydium)
  - **CLMM**: V3-style concentrated liquidity (Uniswap V3, Meteora)
- Each connector has operation-specific route files by type

### 3. API Route Structure

```
Chain routes:     /chains/{chain}/{operation}
Connector routes: /connectors/{dex}/{type}/{operation}
Config routes:    /config/*
Wallet routes:    /wallet/*
Token routes:     /tokens/*
Pool routes:      /pools/*
```

**Examples:**
- `/chains/ethereum/balances`
- `/connectors/uniswap/amm/poolInfo`
- `/connectors/etcswap/clmm/openPosition`

### 4. Connector File Structure

Each connector follows this pattern:
```
src/connectors/{name}/
├── {name}.ts              # Main connector class (singleton)
├── {name}.config.ts       # Configuration (chain, networks, trading types)
├── {name}.contracts.ts    # Contract addresses and ABIs
├── {name}.routes.ts       # Route registration
├── {name}.utils.ts        # Utility functions
├── schemas.ts             # TypeBox request/response schemas
├── amm-routes/            # V2 AMM operations
│   ├── index.ts
│   ├── quoteSwap.ts
│   ├── executeSwap.ts
│   ├── addLiquidity.ts
│   ├── removeLiquidity.ts
│   ├── poolInfo.ts
│   └── positionInfo.ts
├── clmm-routes/           # V3 CLMM operations
│   ├── index.ts
│   ├── openPosition.ts
│   ├── closePosition.ts
│   ├── addLiquidity.ts
│   ├── removeLiquidity.ts
│   ├── collectFees.ts
│   ├── poolInfo.ts
│   ├── positionInfo.ts
│   └── positionsOwned.ts
└── router-routes/         # Universal Router operations
    ├── index.ts
    ├── quoteSwap.ts
    ├── executeSwap.ts
    └── executeQuote.ts
```

### 5. Configuration System

**Chain configs:** `src/templates/chains/{chain}/{network}.yml`
**Connector configs:** `src/templates/connectors/{connector}.yml`
**Token lists:** `src/templates/tokens/{chain}/{network}.json`
**Pool storage:** `src/templates/pools/{connector}.json`
**Schemas:** `src/templates/namespace/{name}-schema.json`
**Root config:** `src/templates/root.yml`

## ETCswap Implementation Guide

### Adding Ethereum Classic Chain

1. Create network configs:
   - `src/templates/chains/ethereum/classic.yml` (mainnet, chain ID 61)
   - `src/templates/chains/ethereum/mordor.yml` (testnet, chain ID 63)

2. Create token lists:
   - `src/templates/tokens/ethereum/classic.json`
   - `src/templates/tokens/ethereum/mordor.json`

3. Register in `src/templates/root.yml`

### Adding ETCswap Connector

1. Copy Uniswap connector as template
2. Update contract addresses from `docs/ETCSWAP-CONTRACTS.md`
3. Configure for `ethereum` chain with networks: `classic`, `mordor`
4. Register routes in `src/app.ts`
5. Add to `src/config/routes/getConnectors.ts`

### Network Naming Convention

| Network | Config Name | Chain ID | Currency |
|---------|-------------|----------|----------|
| Ethereum Classic | `classic` | 61 | ETC |
| Mordor Testnet | `mordor` | 63 | METC |

### Key Differences from Uniswap

1. **Native Asset**: ETC instead of ETH
2. **Chain IDs**: 61 (classic), 63 (mordor)
3. **Wrapped Token**: WETC at `0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a`
4. **Currency Symbol**: ETC (classic), METC (mordor)

## Protected Files

Do not modify without explicit user request:
- `src/app.ts` - Main application setup
- `src/services/config-manager-v2.ts` - Configuration management
- `src/templates/root.yml` - Root configuration
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript configuration

## Coding Style

- 2-space indentation (no tabs)
- Single quotes for strings
- Semicolons required
- Arrow functions preferred
- Explicit typing (TypeBox for API schemas)
- Unused variables prefixed with underscore (`_variable`)
- Use Fastify's `httpErrors` for API errors

## Validation Requirements

**Before Any Commit:**
```bash
pnpm lint       # Must pass
pnpm typecheck  # Must pass
pnpm build      # Must succeed
pnpm test       # Should pass (75% coverage for new code)
```

## Commit Format

```
<scope>: <description>

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Scopes:**
- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `docs:` - Documentation
- `test:` - Tests
- `chore:` - Maintenance

**Examples:**
```
feat: add ETCswap V2 connector for ETC mainnet
feat: add Ethereum Classic chain configuration
fix: correct WETC address in ETCswap contracts
```

## Common Pitfalls

**Don't:**
- Modify protected files without explicit request
- Skip validation (lint, typecheck, build)
- Use `console.log` (use logger instead)
- Hardcode contract addresses (use config files)
- Forget to register new routes in `app.ts`

**Do:**
- Follow Uniswap connector as template for ETCswap
- Use TypeBox for all API schemas
- Create tests for new functionality
- Use singleton pattern for connectors
- Reference `docs/ETCSWAP-CONTRACTS.md` for addresses

## Testing

```bash
# Run all tests
pnpm test

# Run specific test file
GATEWAY_TEST_MODE=dev jest --runInBand path/to/file.test.ts

# Run tests with coverage
pnpm test:cov
```

## Ecosystem Context

This Gateway is part of the ETCswap/Hummingbot integration:

- **Hummingbot** (Python): Trading bot client
- **Gateway** (TypeScript, THIS PROJECT): DEX middleware
- **ETCswap**: DEX on Ethereum Classic

**Related Projects:**
- [ETCswap V2](https://v2.etcswap.org)
- [ETCswap V3](https://v3.etcswap.org)
- [Hummingbot](https://hummingbot.org)

---

Last updated: 2025-01-20
