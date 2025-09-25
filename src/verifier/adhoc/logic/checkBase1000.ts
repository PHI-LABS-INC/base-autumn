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

export async function checkBase1000(address: string): Promise<CredResult> {
  const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY;
  if (!BASESCAN_API_KEY) {
    throw new Error('Basescan API key not provided');
  }

  const publicClient = await createPublicClientForNetwork(base);

  const isContract = await isContractAddress(publicClient, address as Address);
  if (isContract) {
    const jiffyscanTxs = await getJiffyscanTransactions(address as Address, 8453);

    const filteredTxs = jiffyscanTxs.filter(
      (tx) => tx.isError === '0' && tx.from.toLowerCase() === address.toLowerCase(),
    );

    const txCount = filteredTxs.length;
    console.log(`Address ${address} has ${txCount} valid transactions on Base chain (Jiffyscan).`);
    const hasSufficientTxs = txCount >= 1000;
    return [hasSufficientTxs, ''];
  }

  const response = await fetch(
    `https://api.etherscan.io/v2/api?chainid=8453&module=account&action=txlist&address=${address}&startblock=0&endblock=latest&sort=desc&page=1&offset=10000&apikey=${BASESCAN_API_KEY}`,
    {
      headers: {
        accept: 'application/json',
      },
    },
  );

  const data: unknown = await response.json();

  if (!response.ok || (isBaseScanErrorResponse(data) && data.status === '0')) {
    if (data && isBaseScanErrorResponse(data) && data.message === 'No transactions found') {
      return [false, ''];
    }
    throw new Error(`BaseScan API request failed: ${response.statusText}`);
  }

  if (!isBaseScanResponse(data)) {
    throw new Error('Invalid response format from BaseScan API');
  }

  const filteredTxs = data.result.filter((tx) => tx.isError === '0' && tx.from.toLowerCase() === address.toLowerCase());

  const txCount = filteredTxs.length;
  console.log(`Address ${address} has ${txCount} valid transactions on Base chain.`);
  const hasSufficientTxs = txCount >= 1000;

  return [hasSufficientTxs, ''];
}
