import { CredResult } from '../../../utils/types';
import { Address } from 'viem';
import { base } from 'viem/chains';
import { isContractAddress, getJiffyscanTransactions } from '../../utils/jiffyGraph';
import { createPublicClientForNetwork } from '../../utils/contractCall';

type BaseScanTransaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  methodId: string;
  isError: string;
};

type BaseScanResponse = {
  status: string;
  message: string;
  result: BaseScanTransaction[];
};

type BaseScanErrorResponse = {
  status: string;
  message: string;
  result: string;
};

// Type guard functions
function isBaseScanErrorResponse(data: unknown): data is BaseScanErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    'message' in data &&
    'result' in data &&
    typeof (data as any).result === 'string'
  );
}

function isBaseScanResponse(data: unknown): data is BaseScanResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    'message' in data &&
    'result' in data &&
    Array.isArray((data as any).result)
  );
}

// Spring Festival 2025 期間の定義（1月28日から2月4日まで）
const SPRING_FESTIVAL_START = new Date('2025-01-28T00:00:00Z').getTime() / 1000;
const SPRING_FESTIVAL_END = new Date('2025-02-04T23:59:59Z').getTime() / 1000;

export async function checkBaseSpringFestival(address: string): Promise<CredResult> {
  const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY5;
  if (!BASESCAN_API_KEY) {
    throw new Error('Basescan API key not provided');
  }

  const publicClient = await createPublicClientForNetwork(base);

  const isContract = await isContractAddress(publicClient, address as Address);
  if (isContract) {
    const jiffyscanTxs = await getJiffyscanTransactions(address as Address, 8453);

    // Spring Festival期間中のトランザクションをチェック
    const txsInSpringFestival = await Promise.all(
      jiffyscanTxs.map(async (tx) => {
        const block = await publicClient.getBlock({ blockNumber: BigInt(tx.blockNumber) });
        const timestamp = Number(block.timestamp);
        return timestamp >= SPRING_FESTIVAL_START && timestamp <= SPRING_FESTIVAL_END && tx.isError === '0';
      }),
    );

    const txCount = txsInSpringFestival.filter(Boolean).length;
    const hasSufficientTxs = txCount > 0;
    return [hasSufficientTxs, txCount.toString()];
  }

  const response = await fetch(
    `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=latest&sort=desc&apikey=${BASESCAN_API_KEY}`,
    {
      headers: {
        accept: 'application/json',
      },
    },
  );

  const data: unknown = await response.json();

  if (!response.ok || (isBaseScanErrorResponse(data) && data.status === '0')) {
    if (data && isBaseScanErrorResponse(data) && data.message === 'No transactions found') {
      return [false, '0'];
    }
    throw new Error(`BaseScan API request failed: ${response.statusText}`);
  }

  if (!isBaseScanResponse(data)) {
    throw new Error('Invalid response format from BaseScan API');
  }

  // Spring Festival期間中のトランザクションをフィルタリング
  const txsInSpringFestival = data.result.filter((tx) => {
    const timestamp = parseInt(tx.timeStamp);
    return timestamp >= SPRING_FESTIVAL_START && timestamp <= SPRING_FESTIVAL_END && tx.isError === '0';
  });

  const txCount = txsInSpringFestival.length;
  const hasSufficientTxs = txCount > 0;

  return [hasSufficientTxs, txCount.toString()];
}
