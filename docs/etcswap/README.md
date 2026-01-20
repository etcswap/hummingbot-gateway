# ETCswap Documentation

Welcome to the ETCswap integration documentation for Hummingbot Gateway. ETCswap is the leading decentralized exchange on Ethereum Classic, providing V2 (AMM) and V3 (CLMM) liquidity pools.

## Quick Links

- [Getting Started Guide](./GETTING-STARTED.md) - Set up and configure ETCswap
- [API Reference](./API-REFERENCE.md) - Complete API documentation
- [Cross-Chain Arbitrage Tutorial](./CROSS-CHAIN-ARBITRAGE.md) - Arbitrage between Coinbase and ETCswap
- [Contract Reference](../ETCSWAP-CONTRACTS.md) - Contract addresses and technical details

## About ETCswap

ETCswap is a Uniswap fork deployed on Ethereum Classic (ETC). It provides:

- **V2 AMM Pools**: Traditional constant-product (x*y=k) liquidity pools
- **V3 CLMM Pools**: Concentrated liquidity with customizable price ranges
- **Universal Router**: Optimal routing across V2 and V3 pools for best execution

## Supported Networks

| Network | Config Name | Chain ID | Description |
|---------|-------------|----------|-------------|
| Ethereum Classic | `classic` | 61 | Production mainnet |
| Mordor | `mordor` | 63 | Testnet for development |

## Key Features

### Universal Router (Recommended)
The Universal Router finds the best swap route across V2 and V3 pools, optimizing for price and gas efficiency.

### V2 AMM
Classic automated market maker pools with simple constant-product pricing. Lower gas costs, suitable for most trades.

### V3 CLMM
Concentrated liquidity pools where liquidity providers can focus their capital within specific price ranges for higher capital efficiency.

## Stablecoins on ETC

**USC (Classic USD)** is the primary stablecoin on Ethereum Classic:
- Contract: `0xDE093684c796204224BC081f937aa059D903c52a`
- 1:1 with USDC through [Brale Platform](https://brale.xyz)
- Also exchangeable for fiat USD and USDP stablecoin

## Branch Information

This ETCswap integration is maintained on the `etcswap` branch of both hummingbot and hummingbot-gateway repositories. It will be used by the ETC ecosystem until merged upstream into the official Hummingbot repositories.

## Related Resources

- [ETCswap Website](https://etcswap.org)
- [ETCswap V3 App](https://v3.etcswap.org)
- [ETCswap V2 App](https://v2.etcswap.org)
- [Brale Platform](https://brale.xyz) - USC/USDC bridge
- [Classic USD](https://classicusd.com)
- [Ethereum Classic](https://ethereumclassic.org)
