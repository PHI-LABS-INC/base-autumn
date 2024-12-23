import { Address, zeroAddress } from 'viem';
import { CredResult, GeneralTxItem } from '../../../utils/types';
import { getTransactions } from '../../utils/etherscan/transactionUtils';

type RelayBridgeStatus = {
  status: 'refund' | 'delayed' | 'waiting' | 'failure' | 'pending' | 'success';
  inTxHashes: string[];
  txHashes: string[];
  time: string;
  originChainId: number;
  destinationChainId: number;
};

function isRelayBridgeStatus(data: unknown): data is RelayBridgeStatus {
  if (typeof data !== 'object' || data === null) return false;
  const status = data as RelayBridgeStatus;
  return (
    'status' in status &&
    'inTxHashes' in status &&
    'txHashes' in status &&
    'time' in status &&
    'originChainId' in status &&
    'destinationChainId' in status
  );
}

async function getRelayBridgeTransactions(
  api_key: string,
  address: string,
  network: number,
  startblock: string,
  endblock: string,
): Promise<GeneralTxItem[]> {
  const RELAY_CONTRACT = '0xa5F565650890fBA1824Ee0F21EbBbF660a179934';

  return await getTransactions(
    api_key,
    address as Address,
    'txlist',
    zeroAddress,
    [RELAY_CONTRACT],
    ['any'],
    network,
    startblock,
    endblock,
    (tx, contractAddresses, methodIds) => {
      return tx.to.toLowerCase() === RELAY_CONTRACT.toLowerCase();
    },
  );
}

export async function checkRelayBridgeActivity(address: string): Promise<CredResult> {
  try {
    const txs = await getRelayBridgeTransactions(process.env.BASESCAN_API_KEY as string, address, 8453, '0', 'latest');

    if (txs.length === 0) {
      return [false, ''];
    }

    for (const tx of txs) {
      if (!tx.input) continue;

      try {
        const response = await fetch(`https://api.relay.link/intents/status/v2?requestId=${tx.input}`, {
          headers: {
            accept: 'application/json',
          },
        });

        const data: unknown = await response.json();

        if (
          response.ok &&
          isRelayBridgeStatus(data) &&
          data.status === 'success' &&
          data.originChainId === 8453 &&
          data.destinationChainId === 543210
        ) {
          return [true, '0'];
        }
      } catch (error) {
        console.error('Error checking bridge status:', error);
        continue;
      }
    }

    // 有効なブリッジが見つからなかった場合
    return [false, '0'];
  } catch (error) {
    console.error('Error checking Relay Bridge activity:', error);
    throw error;
  }
}
