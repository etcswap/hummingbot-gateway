# ETCswap Connector PR Submission Checklist

This checklist tracks the status of the ETCswap V2 and V3 connector submission to the official Hummingbot Gateway repository.

## PR Status: SUBMITTED

**PR #594:** https://github.com/hummingbot/gateway/pull/594

| Field | Value |
|-------|-------|
| Target Repository | https://github.com/hummingbot/gateway |
| Target Branch | `main` |
| Source Branch | `feat/etcswap-connector` |
| Connector Name | ETCswap |
| Networks | Ethereum Classic (`classic`, Chain ID 61), Mordor Testnet (`mordor`, Chain ID 63) |
| Trading Types | Router, AMM (V2), CLMM (V3) |
| Tests Passing | 134/134 |
| Submitted | 2026-01-22 |

---

## 1. Code Implementation

### 1.1 Connector Core Files
- [x] `src/connectors/etcswap/etcswap.ts` - Main connector class (singleton)
- [x] `src/connectors/etcswap/etcswap.config.ts` - Configuration (chain, networks, trading types)
- [x] `src/connectors/etcswap/etcswap.contracts.ts` - Contract addresses and ABIs
- [x] `src/connectors/etcswap/etcswap.routes.ts` - Route registration
- [x] `src/connectors/etcswap/etcswap.utils.ts` - Utility functions
- [x] `src/connectors/etcswap/schemas.ts` - TypeBox request/response schemas
- [x] `src/connectors/etcswap/universal-router.ts` - Universal Router service

### 1.2 Router Routes (Universal Router)
- [x] `src/connectors/etcswap/router-routes/index.ts`
- [x] `src/connectors/etcswap/router-routes/quoteSwap.ts`
- [x] `src/connectors/etcswap/router-routes/executeSwap.ts`
- [x] `src/connectors/etcswap/router-routes/executeQuote.ts`

### 1.3 AMM Routes (V2)
- [x] `src/connectors/etcswap/amm-routes/index.ts`
- [x] `src/connectors/etcswap/amm-routes/quoteSwap.ts`
- [x] `src/connectors/etcswap/amm-routes/executeSwap.ts`
- [x] `src/connectors/etcswap/amm-routes/addLiquidity.ts`
- [x] `src/connectors/etcswap/amm-routes/removeLiquidity.ts`
- [x] `src/connectors/etcswap/amm-routes/poolInfo.ts`
- [x] `src/connectors/etcswap/amm-routes/positionInfo.ts`

### 1.4 CLMM Routes (V3)
- [x] `src/connectors/etcswap/clmm-routes/index.ts`
- [x] `src/connectors/etcswap/clmm-routes/quoteSwap.ts`
- [x] `src/connectors/etcswap/clmm-routes/executeSwap.ts`
- [x] `src/connectors/etcswap/clmm-routes/openPosition.ts`
- [x] `src/connectors/etcswap/clmm-routes/closePosition.ts`
- [x] `src/connectors/etcswap/clmm-routes/addLiquidity.ts`
- [x] `src/connectors/etcswap/clmm-routes/removeLiquidity.ts`
- [x] `src/connectors/etcswap/clmm-routes/collectFees.ts`
- [x] `src/connectors/etcswap/clmm-routes/poolInfo.ts`
- [x] `src/connectors/etcswap/clmm-routes/positionInfo.ts`
- [x] `src/connectors/etcswap/clmm-routes/positionsOwned.ts`

### 1.5 Configuration Files
- [x] `src/templates/chains/ethereum/classic.yml` - Ethereum Classic network config
- [x] `src/templates/chains/ethereum/mordor.yml` - Mordor testnet config
- [x] `src/templates/tokens/ethereum/classic.json` - Classic token list
- [x] `src/templates/tokens/ethereum/mordor.json` - Mordor token list
- [x] `src/templates/connectors/etcswap.yml` - Connector configuration

### 1.6 App Registration
- [x] Routes registered in `src/app.ts`
- [x] Connector listed in `src/config/routes/getConnectors.ts`

---

## 2. Testing Requirements

### 2.1 Unit Tests
- [x] `test/connectors/etcswap/etcswap.contracts.test.ts` - Contract address tests
- [x] `test/connectors/etcswap/etcswap.routes.test.ts` - Route structure tests
- [x] `test/connectors/etcswap/universal-router.test.ts` - Universal Router tests
- [ ] `test/connectors/etcswap/etcswap.config.test.ts` - Configuration tests
- [ ] `test/connectors/etcswap/etcswap.utils.test.ts` - Utility function tests
- [ ] `test/connectors/etcswap/schemas.test.ts` - Schema validation tests

### 2.2 Route Handler Tests
- [ ] Router routes tests (quote, execute)
- [ ] AMM routes tests (swap, liquidity operations)
- [ ] CLMM routes tests (position management, fees)

### 2.3 Integration Tests
- [ ] End-to-end swap execution tests
- [ ] Liquidity provision tests
- [ ] Position management tests

### 2.4 Coverage Requirements
- [ ] **Minimum 75% test coverage** (run `pnpm test:cov`)
- [ ] All new code paths covered
- [ ] Error handling paths tested

---

## 3. Code Quality

### 3.1 Linting and Formatting
- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm format` applied (Prettier)
- [ ] No `any` types (except SDK workarounds with justification)
- [ ] Unused variables prefixed with `_`

### 3.2 Type Safety
- [ ] `pnpm typecheck` passes
- [ ] All TypeBox schemas properly typed
- [ ] No implicit any

### 3.3 Build
- [ ] `pnpm build` succeeds
- [ ] No build warnings related to ETCswap code

### 3.4 Code Style
- [ ] 2-space indentation (no tabs)
- [ ] Single quotes for strings
- [ ] Semicolons required
- [ ] Arrow functions preferred
- [ ] Fastify httpErrors for API errors
- [ ] Logger used (not console.log)

---

## 4. Documentation

### 4.1 Contract Reference
- [x] `docs/ETCSWAP-CONTRACTS.md` - Complete contract addresses and differences

### 4.2 Implementation Notes
- [x] V2 Router ABI differences documented (ETC vs ETH function names)
- [x] V2 INIT_CODE_HASH differences documented (per-network)
- [x] SDK packages documented

### 4.3 User Documentation (Optional for PR)
- [ ] `docs/etcswap/GETTING-STARTED.md` - Setup guide
- [ ] `docs/etcswap/API-REFERENCE.md` - API documentation
- [ ] `docs/etcswap/CROSS-CHAIN-ARBITRAGE.md` - Trading tutorial

---

## 5. PR Preparation - COMPLETED

### 5.1 Branch Setup
- [x] Fetch latest from upstream: `git fetch upstream`
- [x] Create clean branch from upstream/main: `feat/etcswap-connector`
- [x] Copy only ETCswap-specific files (no community docs)
- [x] All 134 tests passing on clean branch

### 5.2 PR Content
- [x] Clear PR title: `feat: add ETCswap V2 and V3 connector for Ethereum Classic`
- [x] PR description includes:
  - Summary of changes
  - Networks supported (Classic, Mordor)
  - Trading types (Router, AMM, CLMM)
  - Test coverage percentage
  - Link to contract reference
- [x] PR submitted: https://github.com/hummingbot/gateway/pull/594

### 5.3 Pre-submission Verification - PASSED
```bash
# All checks passed on feat/etcswap-connector branch
pnpm lint      # ✓ Passed
pnpm typecheck # ✓ Passed
pnpm build     # ✓ Passed
pnpm test      # ✓ 134 tests passing
```

---

## 6. Post-PR Governance

### 6.1 NCP (New Connector Proposal)
After PR is merged, submit NCP on Snapshot for community vote:

- **Snapshot Space:** https://snapshot.org/#/hbot-ncp.eth
- **Requirement:** 200,000 HBOT tokens to create proposal
- **Voting Period:** 7 days
- **Quorum:** Must meet minimum participation

### 6.2 NCP Proposal Content
- [ ] Connector name and description
- [ ] Networks supported
- [ ] Link to merged PR
- [ ] Team/organization submitting
- [ ] Maintenance commitment

---

## 7. Technical Differences from Uniswap

### V2 Router ABI Differences
ETCswap V2 Router uses `ETC` instead of `ETH` in function names:

| Uniswap V2 | ETCswap V2 |
|------------|------------|
| `addLiquidityETH` | `addLiquidityETC` |
| `removeLiquidityETH` | `removeLiquidityETC` |
| `swapExactETHForTokens` | `swapExactETCForTokens` |
| `swapTokensForExactETH` | `swapTokensForExactETC` |
| `swapExactTokensForETH` | `swapExactTokensForETC` |
| `swapETHForExactTokens` | `swapETCForExactTokens` |

### V2 INIT_CODE_HASH Per Network
| Network | INIT_CODE_HASH |
|---------|----------------|
| Classic | `0xb5e58237f3a44220ffc3dfb989e53735df8fcd9df82c94b13105be8380344e52` |
| Mordor | `0x4d8a51f257ed377a6ac3f829cd4226c892edbbbcb87622bcc232807b885b1303` |

### V3 Contracts
V3 contracts are ABI-compatible with Uniswap V3 - no function name changes.

---

## 8. Quick Commands Reference

```bash
# Development
pnpm install              # Install dependencies
pnpm start --passphrase=<PASS> --dev  # Start in dev mode

# Validation (all must pass)
pnpm lint                 # ESLint check
pnpm typecheck            # TypeScript check
pnpm build                # Build project
pnpm test                 # Run tests
pnpm test:cov             # Coverage report

# Testing specific files
GATEWAY_TEST_MODE=dev jest --runInBand test/connectors/etcswap/

# Git workflow
git fetch upstream
git checkout -b feat/etcswap-v28-upgrade upstream/development
git cherry-pick <commit-hash>
gh pr create --base development
```

---

## Progress Summary

| Category | Status | Notes |
|----------|--------|-------|
| Code Implementation | ✅ Complete | All routes implemented |
| Configuration | ✅ Complete | Both networks configured |
| Unit Tests | ✅ Complete | 100 unit tests passing |
| Live Tests | ✅ Complete | 34 live tests (16 Mordor + 18 Classic) |
| Code Quality | ✅ Complete | Lint/typecheck/build passing |
| Documentation | ✅ Complete | Contract reference complete |
| PR Branch | ✅ Complete | `feat/etcswap-connector` |
| PR Submitted | ✅ Complete | PR #594 |
| NCP Proposal | ⏳ Pending | After PR merge |

---

## Next Steps

1. **PR Review:** Wait for Hummingbot team to review PR #594
2. **Address Feedback:** Respond to any review comments
3. **NCP Proposal:** After merge, submit New Connector Proposal on Snapshot
   - Requires 200,000 HBOT tokens
   - 7-day voting period

---

## Resources

- **Upstream PR:** https://github.com/hummingbot/gateway/pull/594
- **ETCswap Website:** https://etcswap.org
- **ETCswap SDKs:** https://github.com/etcswap/sdks
- **Hummingbot Gateway:** https://github.com/hummingbot/gateway
- **NCP Snapshot Space:** https://snapshot.org/#/hbot-ncp.eth

---

Last updated: 2026-01-22
