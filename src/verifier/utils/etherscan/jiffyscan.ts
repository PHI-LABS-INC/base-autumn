import { Address, Chain, Transport, type PublicClient } from 'viem';
import axios from 'axios';
import { GeneralTxItem } from '../../../utils/types';

export async function isContractAddress(client: PublicClient, address: Address): Promise<boolean> {
  try {
    const code = await client.getCode({
      address,
    });
    //check code length and undefined
    if (code === undefined) {
      return false;
    }
    return code !== '0x';
  } catch (error) {
    console.error('Error checking contract address:', {
      address,
      error: error instanceof Error ? error.message : String(error),
      fullError: error,
      clientState: {
        exists: !!client,
        methods: client ? Object.keys(client) : [],
      },
    });
    return false;
  }
}
const JIFFYSCAN_API_KEYS = [
  process.env.JIFFYSCAN_API_KEY1,
  process.env.JIFFYSCAN_API_KEY2,
  process.env.JIFFYSCAN_API_KEY3,
].filter((key) => key && key.trim() !== '');

function getRandomApiKey() {
  if (JIFFYSCAN_API_KEYS.length === 0) {
    throw new Error('Jiffyscan API key not found');
  }
  const randomIndex = Math.floor(Math.random() * JIFFYSCAN_API_KEYS.length);
  return JIFFYSCAN_API_KEYS[randomIndex];
}

export async function getJiffyscanTransactions(address: Address, network: Chain['id']): Promise<GeneralTxItem[]> {
  const networkName = {
    8453: 'base',
    10: 'optimism',
  }[network];

  if (!networkName) {
    throw new Error(`Unsupported network for Jiffyscan: ${network}`);
  }
  const JIFFYSCAN_API_KEY = getRandomApiKey();

  if (!JIFFYSCAN_API_KEY) {
    throw new Error('Jiffyscan API key not found');
  }
  try {
    const url = `https://api.jiffyscan.xyz/v0/getAddressActivity?address=${address}&network=${networkName}`;
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        'x-api-key': JIFFYSCAN_API_KEY,
      },
    });

    if (!response.data?.accountDetail?.userOps) {
      return [];
    }

    return response.data.accountDetail.userOps.map((op) => ({
      hash: op.userOpHash,
      from: op.sender,
      to: op.target[0],
      blockNumber: op.blockNumber,
      methodId: op.callData?.[0]?.slice(0, 10) || '0x',
      isError: op.success ? '0' : '1',
      input: op.input,
    }));
  } catch (error) {
    console.error('Failed to fetch transactions from Jiffyscan:', error);
    return [];
  }
}
