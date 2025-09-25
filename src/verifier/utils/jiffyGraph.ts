import { Address, Chain, PublicClient } from 'viem';
import { GeneralTxItem } from '../../utils/types';

type NetworkType = 'base' | 'optimism';

interface GraphResponse {
  userOps: Array<{
    sender: string;
    target: string;
    success: boolean;
    blockNumber: string;
    userOpHash: string;
    input: string;
    callData: string;
  }>;
}

interface ExtractedData {
  methodId: string;
  contractAddress: string;
}

interface GraphQLResponse {
  data: GraphResponse;
  errors?: any[];
}

async function getDataFromGraph(
  query: string,
  variables: any,
  network: NetworkType,
  graphApiKey: string,
): Promise<GraphResponse> {
  const GRAPH_ENDPOINTS = {
    base: 'https://gateway-arbitrum.network.thegraph.com/api/{API_KEY}/subgraphs/id/9KToKxWC5uRS5ecCFgAxrScDPU2rVMy3hp7abAkt6BED',
    optimism:
      'https://gateway-arbitrum.network.thegraph.com/api/{API_KEY}/subgraphs/id/HxvH1S81KFam6J7etqtxngjLPhZMS5QcHKwPa7LVz1no',
  };

  const response = await fetch(GRAPH_ENDPOINTS[network].replace('{API_KEY}', graphApiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const json = (await response.json()) as GraphQLResponse;
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}

const ADDRESS_ACTIVITY_QUERY = `
query AddressActivityQuery($address: Bytes, $first: Int, $skip: Int) {
  userOps(first: $first, skip: $skip, orderBy: blockTime, orderDirection: desc, where: { or: [{ sender: $address }, { target: $address }] }) {
    sender
    target
    success
    blockNumber
    userOpHash
    input
    callData
  }
}`;

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

async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
}

export async function isContractAddress(client: PublicClient, address: Address): Promise<boolean> {
  try {
    const code = await client.getCode({ address });

    // If no code exists, it's an EOA (false)
    if (!code || code === '0x') {
      return false;
    }

    // Check if it's an EIP-7702 delegation indicator
    // Format: 0xef0100 + 20-byte address = 23 bytes
    // String length: 0x + 46 characters (23 bytes * 2) = 48 characters
    if (code.length === 48 && code.toLowerCase().startsWith('0xef0100')) {
      return false; // Treat as EIP-7702 delegated EOA
    }

    // Regular smart contract
    return true;
  } catch (error) {
    console.error('Error checking contract address:', {
      address,
      error: error instanceof Error ? error.message : String(error),
      fullError: error,
      clientState: { exists: !!client, methods: client ? Object.keys(client) : [] },
    });
    return false;
  }
}

const NETWORK_MAP = {
  8453: 'base',
  10: 'optimism',
} as const;

export async function getJiffyscanTransactions(address: Address, network: Chain['id']): Promise<GeneralTxItem[]> {
  const networkName = NETWORK_MAP[network];
  if (!networkName) {
    throw new Error(`Unsupported network: ${network}`);
  }

  const graphApiKey = process.env.GRAPH_API_KEY;
  if (!graphApiKey) {
    throw new Error('Graph API key not found');
  }

  try {
    const allUserOps: GeneralTxItem[] = [];
    let skip = 0;

    while (true) {
      const response = await retryOperation(() =>
        getDataFromGraph(ADDRESS_ACTIVITY_QUERY, { address, first: 1000, skip }, networkName, graphApiKey),
      );

      if (!response?.userOps?.length) break;
      allUserOps.push(
        ...response.userOps.map((op) => {
          const { methodId, contractAddress } = extractMethodIdAndContractAddress(op.callData);
          return {
            hash: op.userOpHash,
            from: op.sender,
            to: contractAddress || '',
            blockNumber: op.blockNumber,
            methodId: methodId,
            isError: op.success ? '0' : '1',
            input: op.input,
          };
        }),
      );

      if (response.userOps.length < 1000) break;
      skip += 1000;
    }

    return allUserOps;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return [];
  }
}
