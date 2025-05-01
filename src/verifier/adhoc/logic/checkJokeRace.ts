import { CredResult } from '../../../utils/types';
import { createPublicClient, http, Address, PublicClient } from 'viem';
import { base } from 'viem/chains';

const VOTE_TOPIC = '0x2c9deb38f462962eadbd85a9d3a4120503ee091f1582eaaa10aa8c6797651d29';
const TIMEOUT = 20000; // 20秒タイムアウト
const MAX_TRANSACTIONS = 10000;
const MAX_BLOCK_RANGE = 100000n; // RPC limitation

type BlockRange = {
  fromBlock: bigint;
  toBlock: bigint;
  needsMorePages: boolean;
};

async function getBlockRange(address: string, page = 1): Promise<BlockRange | null> {
  const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY4;
  if (!BASESCAN_API_KEY) throw new Error('Basescan API key not found');

  const response = await fetch(
    `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=latest&page=${page}&offset=10000&sort=asc&apikey=${BASESCAN_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`BaseScan API HTTP error: ${response.status}`);
  }

  const data = await response.json();

  if (!data || typeof data !== 'object') {
    console.error('Invalid BaseScan response format');
    return null;
  }

  if (!('status' in data) || !('result' in data)) {
    console.error('Missing status or result in BaseScan response');
    return null;
  }

  if (!Array.isArray(data.result)) {
    console.error('BaseScan result is not an array');
    return null;
  }

  if (data.result.length === 0) {
    return null;
  }

  const firstTx = data.result[0];
  if (!firstTx || !firstTx.blockNumber) {
    console.error('Invalid transaction data in BaseScan response');
    return null;
  }

  const needsMorePages = data.result.length === MAX_TRANSACTIONS;
  const firstBlock = BigInt(firstTx.blockNumber);
  const lastBlock = BigInt(data.result[data.result.length - 1].blockNumber);

  return {
    fromBlock: firstBlock,
    toBlock: lastBlock,
    needsMorePages,
  };
}

/**
 * Splits a large block range into smaller chunks to avoid RPC limitations
 */
function splitBlockRange(
  fromBlock: bigint,
  toBlock: bigint,
  maxRange: bigint = MAX_BLOCK_RANGE,
): { fromBlock: bigint; toBlock: bigint }[] {
  const ranges: { fromBlock: bigint; toBlock: bigint }[] = [];

  let currentFromBlock = fromBlock;
  while (currentFromBlock <= toBlock) {
    const currentToBlock = currentFromBlock + maxRange - 1n > toBlock ? toBlock : currentFromBlock + maxRange - 1n;

    ranges.push({
      fromBlock: currentFromBlock,
      toBlock: currentToBlock,
    });

    currentFromBlock = currentToBlock + 1n;
  }

  return ranges;
}

export async function checkJokeraceVote(address: string): Promise<CredResult> {
  const timeoutPromise = new Promise<CredResult>((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), TIMEOUT);
  });

  const checkPromise = async (): Promise<CredResult> => {
    if (!process.env.ANKR_BASE) throw new Error('ANKR_BASE env not found');

    const transport = http(process.env.ANKR_BASE);
    const publicClient = createPublicClient({
      chain: base,
      transport,
    }) as PublicClient;

    let page = 1;
    let hasMorePages = true;

    const paddedAddress = address.toLowerCase().replace('0x', '0x000000000000000000000000');

    while (hasMorePages) {
      try {
        const blockRange = await getBlockRange(address, page);
        if (!blockRange) return [false, ''];

        // Split the block range into smaller chunks to avoid RPC limitations
        const blockRanges = splitBlockRange(blockRange.fromBlock, blockRange.toBlock);

        for (const range of blockRanges) {
          try {
            // eth_getLogs を直接呼び出し
            const logs = await publicClient.request({
              method: 'eth_getLogs',
              params: [
                {
                  fromBlock: `0x${range.fromBlock.toString(16)}`,
                  toBlock: `0x${range.toBlock.toString(16)}`,
                  topics: [VOTE_TOPIC, paddedAddress as Address],
                },
              ],
            });

            if (Array.isArray(logs) && logs.length > 0) {
              return [true, ''];
            }
          } catch (error) {
            console.warn(`Error checking logs for block range ${range.fromBlock}-${range.toBlock}:`, error);
            // Continue to next range even if one fails
          }
        }

        hasMorePages = blockRange.needsMorePages;
        page++;
      } catch (error) {
        console.error('Error getting block range:', error);
        return [false, ''];
      }
    }

    return [false, ''];
  };

  try {
    return await Promise.race([checkPromise(), timeoutPromise]);
  } catch (error) {
    if (error instanceof Error && error.message === 'Operation timed out') {
      console.error('Jokerace vote check timed out');
      return [false, ''];
    }
    console.error('Unexpected error:', error);
    return [false, ''];
  }
}
