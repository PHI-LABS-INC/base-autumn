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

interface ExtractedData {
  methodId: string;
  contractAddress: string;
}

interface ExtractedData {
  methodId: string;
  contractAddress: string;
}

interface ExtractedData {
  methodId: string;
  contractAddress: string;
}

function extractMethodIdAndContractAddress(preDecodedCallData: string): ExtractedData {
  if (!preDecodedCallData || !preDecodedCallData.startsWith('0x')) {
    return { methodId: '0x', contractAddress: '' };
  }

  try {
    // Contract address is at fixed position (226-266)
    const contractAddress = '0x' + preDecodedCallData.slice(226, 266);

    // Method ID is at position 458 (8 characters)
    // Check if we have enough data
    if (preDecodedCallData.length >= 466) {
      const methodId = '0x' + preDecodedCallData.slice(458, 466);
      return { methodId, contractAddress };
    }

    return { methodId: '0x', contractAddress };
  } catch (error) {
    console.error('Error extracting data:', error);
    return { methodId: '0x', contractAddress: '' };
  }
}

export async function getJiffyscanTransactions(address: Address, network: Chain['id']): Promise<GeneralTxItem[]> {
  // Determine the network name based on the chain ID
  const networkName = {
    8453: 'base',
    10: 'optimism',
  }[network];

  if (!networkName) {
    throw new Error(`Unsupported network for Jiffyscan: ${network}`);
  }

  // Get a random API key from the available keys
  const JIFFYSCAN_API_KEY = getRandomApiKey();

  if (!JIFFYSCAN_API_KEY) {
    throw new Error('Jiffyscan API key not found');
  }

  try {
    // Construct the Jiffyscan API URL
    const url = `https://api.jiffyscan.xyz/v0/getAddressActivity?address=${address}&network=${networkName}`;
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        'x-api-key': JIFFYSCAN_API_KEY,
      },
    });

    // Return empty array if no user operations found
    if (!response.data?.accountDetail?.userOps) {
      return [];
    }

    // Map user operations to GeneralTxItem format
    return response.data.accountDetail.userOps.map((op) => {
      // Extract method ID and contract address
      const { methodId, contractAddress } = extractMethodIdAndContractAddress(op.preDecodedCallData);
      console.log('Method ID:', methodId, 'Contract Address:', contractAddress);
      return {
        hash: op.userOpHash,
        from: op.sender,
        to: contractAddress || '',
        blockNumber: op.blockNumber,
        methodId: methodId,
        isError: op.success ? '0' : '1',
        input: op.input,
      };
    });
  } catch (error) {
    console.error('Failed to fetch transactions from Jiffyscan:', error);
    return [];
  }
}
