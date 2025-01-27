import { CredResult } from '../../../utils/types';
import { Address } from 'viem';
import { base } from 'viem/chains';
import { isContractAddress, getJiffyscanTransactions } from '../../utils/jiffyGraph';
import { createPublicClientForNetwork } from '../../utils/contractCall';

// BaseScan APIのレスポンス型定義
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

export async function checkBase2025(address: string): Promise<CredResult> {
  const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY3;
  if (!BASESCAN_API_KEY) {
    throw new Error('Basescan API key not provided');
  }

  const publicClient = await createPublicClientForNetwork(base);

  const isContract = await isContractAddress(publicClient, address as Address);
  if (isContract) {
    console.log('Using Jiffyscan API');
    const jiffyscanTxs = await getJiffyscanTransactions(address as Address, 8453);

    // timeStampがない場合は、blockNumberから概算する
    const txsIn2025 = await Promise.all(
      jiffyscanTxs.map(async (tx) => {
        const block = await publicClient.getBlock({ blockNumber: BigInt(tx.blockNumber) });
        const txDate = new Date(Number(block.timestamp) * 1000);
        const year = txDate.getUTCFullYear();
        return year === 2025 && tx.isError === '0';
      }),
    );

    const txCount = txsIn2025.filter(Boolean).length;
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

  // エラーレスポンスのチェック
  if (!response.ok || (isBaseScanErrorResponse(data) && data.status === '0')) {
    if (data && isBaseScanErrorResponse(data) && data.message === 'No transactions found') {
      return [false, '0'];
    }
    throw new Error(`BaseScan API request failed: ${response.statusText}`);
  }

  if (!isBaseScanResponse(data)) {
    throw new Error('Invalid response format from BaseScan API');
  }

  const txsIn2025 = data.result.filter((tx) => {
    const txDate = new Date(parseInt(tx.timeStamp) * 1000);
    const year = txDate.getUTCFullYear();
    return year === 2025 && tx.isError === '0';
  });

  const txCount = txsIn2025.length;
  const hasSufficientTxs = txCount > 0;

  return [hasSufficientTxs, txCount.toString()];
}
