# GitHub Copilot Instructions for Hummingbot Gateway

## Project Overview

Hummingbot Gateway is a TypeScript-based API middleware for blockchain and DEX interactions. Current focus: adding ETCswap V2/V3 connectors for Ethereum Classic (`classic` mainnet, `mordor` testnet).

## Tech Stack

- Node.js 20.x+, TypeScript 5.x, pnpm
- Fastify with TypeBox schema validation
- ethers.js for Ethereum interactions
- Jest for testing (75% coverage minimum)

## Commands

```bash
pnpm install              # Install dependencies
pnpm run setup           # Interactive setup
pnpm start --passphrase=<PW> --dev  # Dev mode (HTTP)
pnpm lint                # ESLint
pnpm typecheck           # TypeScript check
pnpm build               # Build
pnpm test                # Run tests
```

## Key Patterns

### Connector Structure
```
src/connectors/{name}/
├── {name}.ts              # Main class (singleton)
├── {name}.config.ts       # Config (chain, networks)
├── {name}.contracts.ts    # Contract addresses
├── {name}.routes.ts       # Route registration
├── amm-routes/            # V2 operations
├── clmm-routes/           # V3 operations
└── router-routes/         # Router operations
```

### API Routes
- Chain: `/chains/{chain}/{operation}`
- Connector: `/connectors/{dex}/{type}/{operation}`

### Configuration Files
- Chain configs: `src/templates/chains/{chain}/{network}.yml`
- Connector configs: `src/templates/connectors/{connector}.yml`
- Token lists: `src/templates/tokens/{chain}/{network}.json`

## ETCswap Reference

See `docs/ETCSWAP-CONTRACTS.md` for all contract addresses.

**Key Addresses (Mainnet):**
- WETC: `0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a`
- V2 Factory: `0x0307cd3D7DA98A29e6Ed0D2137be386Ec1e4Bc9C`
- V2 Router: `0x79Bf07555C34e68C4Ae93642d1007D7f908d60F5`
- V3 Factory: `0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC`
- V3 SwapRouter02: `0xEd88EDD995b00956097bF90d39C9341BBde324d1`

**Networks:** `classic` (chain ID 61), `mordor` (chain ID 63)

## Protected Files

Do not modify without explicit request:
- `src/app.ts`
- `src/services/config-manager-v2.ts`
- `package.json`, `tsconfig.json`

## Code Style

- 2-space indentation, single quotes, semicolons required
- Arrow functions preferred
- TypeBox for API schemas
- Use logger, not console.log
- Fastify httpErrors for API errors

## Validation Before Commit

All must pass:
```bash
pnpm lint && pnpm typecheck && pnpm build
```

## Common Pitfalls

- Don't hardcode addresses (use config)
- Don't forget to register routes in `app.ts`
- Don't skip TypeBox schema definitions
- Do follow Uniswap connector as template
- Do create tests for new code
