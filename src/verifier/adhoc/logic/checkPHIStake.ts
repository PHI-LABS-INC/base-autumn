import { CredResult } from '../../../utils/types';
import { Address } from 'viem';
import { base } from 'viem/chains';
import { createPublicClientForNetwork } from '../../utils/contractCall';

const STPHI_TOKEN_ADDRESS = '0x929B592E06f535C1F7D304212F42F9DFcb0A847a' as Address;

export async function checkPHIStake(address: string): Promise<CredResult> {
  try {
    const publicClient = await createPublicClientForNetwork(base);

    const balance = await publicClient.readContract({
      address: STPHI_TOKEN_ADDRESS,
      abi: [
        {
          inputs: [{ name: 'account', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'balanceOf',
      args: [address as Address],
    });

    const hasStake = balance > 0n;
    return [hasStake, hasStake ? balance.toString() : ''];
  } catch (error) {
    console.error('Error checking stPhi stake:', error);
    return [false, ''];
  }
}