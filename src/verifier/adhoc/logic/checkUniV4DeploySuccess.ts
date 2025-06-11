import { CredResult } from '../../../utils/types';

// Constants
const TARGET_ADDRESS = '0x48e516b34a1274f49457b9c6182097796d0498cb';
const DEPLOY_METHOD_ID = '0x00774360';
const ETHERSCAN_API_URL = 'https://api.etherscan.io/v2/api';

/**
 * Check if deploy method was successfully executed
 * @param address User's wallet address
 * @returns true if deploy was successful, false otherwise
 */
export async function checkDeploySuccess(address: string): Promise<CredResult> {
  try {
    const params = new URLSearchParams({
      chainid: '1',
      module: 'account',
      action: 'txlist',
      address,
      startblock: '21144578',
      endblock: '21688329',
      sort: 'desc',
      page: '1',
      offset: '10000',
      apikey: process.env.BASESCAN_API_KEY4 || '',
    });

    const response = await fetch(`${ETHERSCAN_API_URL}?${params}`);
    const data: any = await response.json();
    console.log('Etherscan response:', data);
    if (data.status !== '1' || !data.result) {
      return [false, ''];
    }

    // Check if any transaction has the deploy method and was successful
    const hasSuccessfulDeploy = data.result.some(
      (tx: any) =>
        tx.input.startsWith(DEPLOY_METHOD_ID) &&
        tx.isError === '0' &&
        tx.to &&
        tx.to.toLowerCase() === TARGET_ADDRESS.toLowerCase(),
    );

    return [hasSuccessfulDeploy, ''];
  } catch (error) {
    console.error('Error checking deploy status:', error);
    return [false, ''];
  }
}
