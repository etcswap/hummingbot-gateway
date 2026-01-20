import { FastifyPluginAsync } from 'fastify';

import executeSwapRoute from './executeSwap';
import poolInfoRoute from './poolInfo';
import quoteSwapRoute from './quoteSwap';

/**
 * ETCswap CLMM (V3) routes
 *
 * Note: ETCswap V3 is only available on Ethereum Classic mainnet (classic).
 * On Mordor testnet, V3 is not deployed.
 *
 * Currently implemented:
 * - pool-info: Get pool information
 * - quote-swap: Get swap quote
 * - execute-swap: Execute a swap
 *
 * Position management routes (open-position, add-liquidity, etc.) can be added
 * following the same pattern as the Uniswap CLMM routes.
 */
export const etcswapClmmRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(poolInfoRoute);
  await fastify.register(quoteSwapRoute);
  await fastify.register(executeSwapRoute);
};

export default etcswapClmmRoutes;
