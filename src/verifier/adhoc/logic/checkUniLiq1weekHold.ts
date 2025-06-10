import { base } from 'viem/chains';
import { CredResult } from '../../../utils/types';
import { createPublicClientForNetwork } from '../../utils/contractCall';

// Constants
const POSITION_MANAGER_ADDRESS = '0x7c5f5a4bbd8fd63184577525326123b519429bdc'; // Update with actual address on Base
const BASE_SUBGRAPH_URL = 'https://gateway.thegraph.com/api/subgraphs/id/HNCFA9TyBqpo5qpe6QreQABAA1kV8g46mhkCcicu6v2R'; // Base subgraph URL

// GraphQL Query - createdAtTimestampを追加
const GET_POSITIONS_QUERY = `
  query GetPositions($owner: String!) {
    positions(where: { owner: $owner }) {
      tokenId
      owner
      id
      createdAtTimestamp
    }
  }
`;

// Contract ABI
const POSITION_MANAGER_ABI = [
  {
    name: 'getPositionLiquidity',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'liquidity', type: 'uint128' }],
  },
] as const;

interface SubgraphPosition {
  id: string;
  tokenId: string;
  owner: string;
  createdAtTimestamp: string;
}

/**
 * Make GraphQL request using native fetch
 */
async function graphqlRequest<T>(
  url: string,
  query: string,
  variables: any,
  headers?: Record<string, string>,
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const json: any = await response.json();

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}

/**
 * Check if user has any position created more than a week ago with liquidity > 0
 * @param userAddress User's wallet address
 * @returns true if user has qualifying position, false otherwise
 */
export async function checkUniLiq1weekHold(address: string): Promise<CredResult> {
  try {
    // 1. Fetch user's positions from subgraph
    const headers = {
      Authorization: 'Bearer ' + process.env.GRAPH_API_KEY,
    };

    const response = await graphqlRequest<{ positions: SubgraphPosition[] }>(
      BASE_SUBGRAPH_URL,
      GET_POSITIONS_QUERY,
      { owner: address.toLowerCase() },
      headers,
    );

    if (response.positions.length === 0) {
      return [false, ''];
    }

    // Calculate timestamp for one week ago
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const oneWeekAgo = currentTimestamp - 7 * 24 * 60 * 60;

    // Filter positions created more than a week ago
    const oldPositions = response.positions.filter((p) => parseInt(p.createdAtTimestamp) <= oneWeekAgo);

    if (oldPositions.length === 0) {
      return [false, ''];
    }

    // Check liquidity for old positions
    const publicClient = await createPublicClientForNetwork(base);

    for (const position of oldPositions) {
      const tokenId = BigInt(position.tokenId);

      // Get current liquidity
      const liquidity = (await publicClient.readContract({
        address: POSITION_MANAGER_ADDRESS,
        abi: POSITION_MANAGER_ABI,
        functionName: 'getPositionLiquidity',
        args: [tokenId],
      })) as bigint;

      // Found a position with liquidity > 0
      if (liquidity > 0n) {
        console.log(`Position ${tokenId} created at ${position.createdAtTimestamp} has liquidity ${liquidity}`);
        return [true, ''];
      }
    }

    return [false, ''];
  } catch (error) {
    console.error('Error checking position:', error);
    return [false, ''];
  }
}
