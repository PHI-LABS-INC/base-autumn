import { CredResult } from '../../../utils/types';

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

export async function checkBase3am(address: string): Promise<CredResult> {
  const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY2;

  if (!BASESCAN_API_KEY) {
    throw new Error('Basescan API key not provided');
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

  // 3AMのトランザクションをフィルタリング
  const lateNightTxs = data.result.filter((tx) => {
    const txDate = new Date(parseInt(tx.timeStamp) * 1000);
    const hour = txDate.getUTCHours();
    return hour === 3 && tx.isError === '0'; // エラーのないトランザクションのみカウント
  });

  const txCount = lateNightTxs.length;
  const hasSufficientTxs = txCount > 0;

  return [hasSufficientTxs, txCount.toString()];
}
