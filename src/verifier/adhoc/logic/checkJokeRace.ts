import { CredResult } from '../../../utils/types';

const VOTE_TOPIC = '0x2c9deb38f462962eadbd85a9d3a4120503ee091f1582eaaa10aa8c6797651d29';
const CAST_VOTE_METHOD_ID = '0x2c0a3f89'; // castVote(uint256,uint256)
const TARGET_CONTRACT = '0x36f73615381B8ad68E2F3D7d473C8D88A6d9e97B';
const TIMEOUT = 25000; // 25秒タイムアウト
const MAX_BLOCK_RANGE = 200000;
const ROUTESCAN_OFFSET = 10000;

async function fetchLogsFromRouteScan(address: string, fromBlock: number, toBlock: number): Promise<any[]> {
  const ROUTESCAN_API_KEY = process.env.ROUTESCAN_API_KEY;
  if (!ROUTESCAN_API_KEY) throw new Error('RouteScan API key not found');

  const paddedAddress = '0x000000000000000000000000' + address.toLowerCase().substring(2);

  let page = 1;
  let allLogs: any[] = [];

  while (true) {
    const url = `https://api.routescan.io/v2/network/mainnet/evm/8453/etherscan/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&topic0=${VOTE_TOPIC}&topic1=${paddedAddress}&page=${page}&offset=${ROUTESCAN_OFFSET}&apikey=${ROUTESCAN_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`RouteScan API HTTP error: ${response.status}`);
    }

    const data = (await response.json()) as any;
    if (!data.result || data.result.length === 0) break;

    allLogs = allLogs.concat(data.result);

    if (data.result.length < ROUTESCAN_OFFSET) break;
    page++;
  }

  return allLogs;
}

async function fetchTransactionsFromBaseScan(address: string, fromBlock: number, toBlock: number): Promise<any[]> {
  const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY4;
  if (!BASESCAN_API_KEY) throw new Error('Basescan API key not found');

  const response = await fetch(
    `https://api.etherscan.io/v2/api?chainid=8453&module=account&action=txlist&address=${address}&startblock=${fromBlock}&endblock=${toBlock}&page=1&offset=10000&sort=asc&apikey=${BASESCAN_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`BaseScan API HTTP error: ${response.status}`);
  }

  const data = (await response.json()) as any;
  return data?.result || [];
}

async function getUserTxBlockRange(address: string): Promise<{ fromBlock: number; toBlock: number } | null> {
  const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY4;
  if (!BASESCAN_API_KEY) throw new Error('Basescan API key not found');

  const response = await fetch(
    `https://api.etherscan.io/v2/api?chainid=8453&module=account&action=txlist&address=${address}&startblock=0&endblock=latest&page=1&offset=10000&sort=asc&apikey=${BASESCAN_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`BaseScan API HTTP error: ${response.status}`);
  }

  const data = (await response.json()) as any;
  if (!data?.result?.length) return null;

  const firstBlock = parseInt(data.result[0].blockNumber, 10);
  const lastBlock = parseInt(data.result[data.result.length - 1].blockNumber, 10);

  return { fromBlock: firstBlock, toBlock: lastBlock };
}

async function checkCastVoteTransactions(address: string, fromBlock: number, toBlock: number): Promise<boolean> {
  const transactions = await fetchTransactionsFromBaseScan(address, fromBlock, toBlock);

  const castVoteTransactions = transactions.filter(
    (tx) =>
      tx.to &&
      tx.to.toLowerCase() === TARGET_CONTRACT.toLowerCase() &&
      tx.input &&
      tx.input.toLowerCase().startsWith(CAST_VOTE_METHOD_ID.toLowerCase()),
  );

  if (castVoteTransactions.length > 0) {
    console.log(
      `✅ castVote transaction found: ${castVoteTransactions[0].hash} at block ${castVoteTransactions[0].blockNumber}`,
    );
    return true;
  }

  return false;
}

export async function checkJokeraceVote(address: string): Promise<CredResult> {
  const startTime = Date.now();
  const timeoutPromise = new Promise<CredResult>((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), TIMEOUT);
  });

  const checkPromise = async (): Promise<CredResult> => {
    try {
      const blockRange = await getUserTxBlockRange(address);
      if (!blockRange) {
        console.log('❌ No transaction history found.');
        return [false, ''];
      }

      let currentToBlock = blockRange.toBlock;
      const earliestBlock = blockRange.fromBlock;

      while (currentToBlock >= earliestBlock) {
        if (Date.now() - startTime > TIMEOUT - 3000) {
          console.warn('⚠️ Approaching timeout limit, stopping further checks.');
          break;
        }

        const currentFromBlock =
          currentToBlock - MAX_BLOCK_RANGE < earliestBlock ? earliestBlock : currentToBlock - MAX_BLOCK_RANGE;
        console.log(`Checking block range ${currentFromBlock}-${currentToBlock}`);

        // Check for traditional vote logs
        const logs = await fetchLogsFromRouteScan(address, currentFromBlock, currentToBlock);

        if (logs.length > 0) {
          console.log(`✅ Vote found at block ${logs[0].blockNumber}`);
          return [true, ''];
        }

        // Check for castVote transactions to the specific contract
        const hasCastVote = await checkCastVoteTransactions(address, currentFromBlock, currentToBlock);
        if (hasCastVote) {
          return [true, ''];
        }

        currentToBlock = currentFromBlock - 1;
      }

      console.log('❌ No vote found within checked block ranges.');
      return [false, ''];
    } catch (error) {
      console.error('🚨 API error:', error);
      return [false, ''];
    }
  };

  try {
    return await Promise.race([checkPromise(), timeoutPromise]);
  } catch (error) {
    console.error('🚨 Unexpected error:', error);
    return [false, ''];
  }
}
