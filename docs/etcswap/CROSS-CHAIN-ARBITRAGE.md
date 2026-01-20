# Cross-Chain Arbitrage Tutorial: Coinbase + ETCswap

This tutorial shows you how to set up cross-chain arbitrage between Coinbase (CEX) and ETCswap (DEX) using the ETC/USDC pair on Coinbase and ETC/USC pair on ETCswap.

## Overview

### The Opportunity

Arbitrage opportunities exist when the same asset trades at different prices on different exchanges. In this case:

- **Coinbase**: Trades ETC/USDC (centralized exchange)
- **ETCswap V3**: Trades ETC/USC (decentralized exchange on Ethereum Classic)

### Understanding USC and USDC

**USC (Classic USD)** is a stablecoin on Ethereum Classic that maintains 1:1 parity with USDC through the [Brale Platform](https://brale.xyz):

- USC can be exchanged 1:1 for USDC
- USC can be exchanged 1:1 for fiat USD
- USC can be exchanged 1:1 for USDP stablecoin

This 1:1 relationship means that price differences between ETC/USDC (Coinbase) and ETC/USC (ETCswap) represent real arbitrage opportunities.

### Arbitrage Flow

**When ETC is cheaper on ETCswap:**
1. Buy ETC on ETCswap with USC
2. Bridge/convert USC to USDC via Brale
3. Sell ETC on Coinbase for USDC
4. Profit = (Coinbase price - ETCswap price) - fees

**When ETC is cheaper on Coinbase:**
1. Buy ETC on Coinbase with USDC
2. Withdraw ETC to your Ethereum Classic wallet
3. Sell ETC on ETCswap for USC
4. Convert USC to USDC via Brale
5. Profit = (ETCswap price - Coinbase price) - fees

## Prerequisites

### Accounts and Wallets

1. **Coinbase Pro/Advanced account** with API access
2. **Ethereum Classic wallet** with:
   - ETC for gas fees
   - USC or WETC for trading
3. **Brale Platform account** for USC/USDC conversion

### Software

1. **Hummingbot** (trading bot)
2. **Hummingbot Gateway** (DEX connectivity)

### Capital Requirements

- USDC on Coinbase for buying ETC
- USC on Ethereum Classic for buying ETC
- ETC on both exchanges for gas and trading

## Setup Guide

### Step 1: Install Hummingbot and Gateway

```bash
# Clone repositories (using ETCswap forks until merged upstream)
git clone https://github.com/etcswap/hummingbot.git
git clone https://github.com/etcswap/hummingbot-gateway.git

# Checkout ETCswap branches
cd hummingbot && git checkout etcswap && cd ..
cd hummingbot-gateway && git checkout etcswap && cd ..
```

> **Note:** Once merged upstream, use `https://github.com/hummingbot/hummingbot.git` and `https://github.com/hummingbot/gateway.git`.

### Step 2: Configure Gateway

```bash
cd hummingbot-gateway
pnpm install
pnpm build

# Copy and edit environment
cp .env.example .env
```

Edit `.env`:
```env
PORT=15888
LOG_LEVEL=info
ETHEREUM_CLASSIC_RPC=https://etc.rivet.link
```

Start the gateway:
```bash
pnpm start
```

### Step 3: Configure Hummingbot

Start Hummingbot:
```bash
cd hummingbot
./start
```

In the Hummingbot CLI:

```
# Connect to Gateway
gateway connect

# Add your Ethereum Classic wallet
gateway wallet-add ethereum classic YOUR_PRIVATE_KEY

# Connect Coinbase
connect coinbase
```

### Step 4: Approve Tokens for ETCswap

Before trading, approve USC for the Universal Router:

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

### Step 5: Configure the Arbitrage Strategy

In Hummingbot, create an arbitrage strategy:

```
create
```

Select strategy parameters:
- Strategy: `amm_arb`
- Primary Market: `coinbase` (or `coinbase_pro`)
- Primary Trading Pair: `ETC-USDC`
- Secondary Market: `etcswap_ethereum_classic` (or gateway connector name)
- Secondary Trading Pair: `ETC-USC`
- Order Amount: Start small (e.g., 0.1 ETC)
- Min Profitability: 0.5% (adjust based on fees)

### Step 6: Understand Fee Structure

Calculate your minimum profitable spread:

| Fee Component | Typical Cost |
|---------------|--------------|
| Coinbase trading fee | 0.1% - 0.6% |
| ETCswap V3 trading fee | 0.3% |
| ETC gas (ETCswap) | ~0.001 ETC |
| Brale conversion fee | Check current rates |
| ETC withdrawal (Coinbase) | Variable |

**Minimum spread needed** = Sum of all fees + profit margin

Example: If total fees are 1%, set min profitability to 1.5% for 0.5% profit.

## Manual Arbitrage Example

If you prefer manual trading, here's how to check for opportunities:

### Check Prices

**Coinbase price:**
```bash
# Use Coinbase API or check their website
curl https://api.coinbase.com/v2/prices/ETC-USD/spot
```

**ETCswap price:**
```bash
curl "http://localhost:15888/connectors/etcswap/router/quote-swap?\
network=classic&\
baseToken=ETC&\
quoteToken=USC&\
amount=1&\
side=SELL"
```

### Execute Arbitrage (ETCswap Cheaper)

1. **Buy ETC on ETCswap:**
```bash
curl -X POST http://localhost:15888/connectors/etcswap/router/execute-swap \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "YOUR_WALLET",
    "network": "classic",
    "baseToken": "ETC",
    "quoteToken": "USC",
    "amount": 10,
    "side": "BUY",
    "slippagePct": 0.5
  }'
```

2. **Convert USC to USDC** via [Brale Platform](https://brale.xyz)

3. **Sell ETC on Coinbase** (use Coinbase API or interface)

### Execute Arbitrage (Coinbase Cheaper)

1. **Buy ETC on Coinbase** (use Coinbase API or interface)

2. **Withdraw ETC to your Ethereum Classic wallet**

3. **Sell ETC on ETCswap:**
```bash
curl -X POST http://localhost:15888/connectors/etcswap/router/execute-swap \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "YOUR_WALLET",
    "network": "classic",
    "baseToken": "ETC",
    "quoteToken": "USC",
    "amount": 10,
    "side": "SELL",
    "slippagePct": 0.5
  }'
```

4. **Convert USC to USDC** via Brale Platform

## Advanced: Automated Strategy

### Python Script Example

```python
import requests
import time

GATEWAY_URL = "http://localhost:15888"
WALLET_ADDRESS = "YOUR_WALLET_ADDRESS"
MIN_PROFIT_PCT = 1.5  # Minimum profit percentage

def get_etcswap_price(amount=1, side="SELL"):
    """Get ETC/USC price from ETCswap"""
    params = {
        "network": "classic",
        "baseToken": "ETC",
        "quoteToken": "USC",
        "amount": amount,
        "side": side
    }
    response = requests.get(
        f"{GATEWAY_URL}/connectors/etcswap/router/quote-swap",
        params=params
    )
    return response.json()

def get_coinbase_price():
    """Get ETC/USD price from Coinbase"""
    response = requests.get(
        "https://api.coinbase.com/v2/prices/ETC-USD/spot"
    )
    data = response.json()
    return float(data["data"]["amount"])

def check_arbitrage():
    """Check for arbitrage opportunity"""
    # Get prices
    etcswap_quote = get_etcswap_price(1, "SELL")
    etcswap_price = etcswap_quote["price"]  # USC per ETC
    coinbase_price = get_coinbase_price()   # USD per ETC

    # Calculate spread (USC = USDC = USD)
    spread_pct = ((coinbase_price - etcswap_price) / etcswap_price) * 100

    print(f"ETCswap: {etcswap_price:.4f} USC/ETC")
    print(f"Coinbase: {coinbase_price:.4f} USD/ETC")
    print(f"Spread: {spread_pct:.2f}%")

    if abs(spread_pct) >= MIN_PROFIT_PCT:
        if spread_pct > 0:
            print(">>> BUY on ETCswap, SELL on Coinbase")
        else:
            print(">>> BUY on Coinbase, SELL on ETCswap")
        return True

    return False

def main():
    """Main loop"""
    while True:
        try:
            check_arbitrage()
        except Exception as e:
            print(f"Error: {e}")
        time.sleep(10)  # Check every 10 seconds

if __name__ == "__main__":
    main()
```

## Risk Management

### Key Risks

1. **Price Movement**: Prices can change between legs of the arbitrage
2. **Transaction Delays**: Blockchain confirmations and withdrawal times
3. **Liquidity**: Large orders may move the price (slippage)
4. **Bridge Risk**: USC/USDC conversion has settlement time
5. **Smart Contract Risk**: DEX contracts could have vulnerabilities

### Mitigation Strategies

1. **Start Small**: Test with small amounts first
2. **Set Slippage Limits**: Use appropriate slippage tolerance
3. **Monitor Gas Prices**: High gas can eliminate profits
4. **Diversify**: Don't put all capital in one trade
5. **Use Limit Orders**: On Coinbase, use limit orders to control price

## Monitoring and Logging

### Enable Detailed Logging

In Gateway, set `LOG_LEVEL=debug` for detailed transaction logs.

### Track Your Performance

Keep records of:
- Entry and exit prices
- Fees paid
- Profit/loss per trade
- Time between legs

### Price Alerts

Set up price monitoring to catch opportunities:

```python
import requests
import smtplib

def send_alert(message):
    # Configure your email/SMS alerting
    pass

def monitor_spread():
    while True:
        etcswap = get_etcswap_price()["price"]
        coinbase = get_coinbase_price()
        spread = abs(coinbase - etcswap) / min(coinbase, etcswap) * 100

        if spread > 2.0:  # 2% spread
            send_alert(f"Arbitrage opportunity! Spread: {spread:.2f}%")

        time.sleep(60)
```

## Troubleshooting

### Common Issues

**"Insufficient balance"**
- Ensure you have enough ETC for gas
- Ensure you have enough USC/USDC for trades

**"Quote expired"**
- Quotes are only valid briefly; execute quickly after getting quote

**"Slippage exceeded"**
- Increase slippage tolerance
- Reduce trade size

**"Transaction pending too long"**
- ETC network may be congested
- Consider increasing gas price

### Support Resources

- [ETCswap Discord](https://discord.gg/etcswap)
- [Hummingbot Discord](https://discord.gg/hummingbot)
- [Brale Platform Support](https://brale.xyz)

## Conclusion

Cross-chain arbitrage between Coinbase and ETCswap can be profitable when:
- The spread exceeds your total fees
- You can execute both legs quickly
- You manage risks appropriately

Start with small amounts, understand all the fees involved, and gradually scale up as you become more familiar with the process.

## Related Resources

- [Getting Started Guide](./GETTING-STARTED.md)
- [API Reference](./API-REFERENCE.md)
- [ETCswap Contract Reference](../ETCSWAP-CONTRACTS.md)
- [Brale Platform](https://brale.xyz) - USC/USDC bridge
- [Classic USD](https://classicusd.com) - USC stablecoin information
