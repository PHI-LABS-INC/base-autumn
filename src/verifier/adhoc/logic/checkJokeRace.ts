import { CredResult } from '../../../utils/types';
import { createPublicClient, http, Address, PublicClient } from 'viem';
import { base } from 'viem/chains';

const VOTE_TOPIC = '0x2c9deb38f462962eadbd85a9d3a4120503ee091f1582eaaa10aa8c6797651d29';
const TIMEOUT = 20000; // 20秒タイムアウト
const MAX_TRANSACTIONS = 10000;

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

        // eth_getLogs を直接呼び出し
        const logs = await publicClient.request({
          method: 'eth_getLogs',
          params: [
            {
              fromBlock: `0x${blockRange.fromBlock.toString(16)}`,
              toBlock: `0x${blockRange.toBlock.toString(16)}`,
              topics: [VOTE_TOPIC, paddedAddress as Address],
            },
          ],
        });

        if (Array.isArray(logs) && logs.length > 0) {
          return [true, ''];
        }

        hasMorePages = blockRange.needsMorePages;
        page++;
      } catch (error) {
        console.error('Error checking logs:', error);
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
