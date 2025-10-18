import { CredResult } from '../../../utils/types';
import { Address } from 'viem';
import { base } from 'viem/chains';
import { createPublicClientForNetwork } from '../../utils/contractCall';

const PHI_TOKEN_ADDRESS = '0xFb3aD5550ca5730A6F91350032c4Da1eFdfDE3E8' as Address;

export async function checkPHIHold(address: string): Promise<CredResult> {
  try {
    const publicClient = await createPublicClientForNetwork(base);

    const balance = await publicClient.readContract({
      address: PHI_TOKEN_ADDRESS,
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

    const hasBalance = balance > 0n;
    return [hasBalance, hasBalance ? balance.toString() : ''];
  } catch (error) {
    console.error('Error checking PHI token balance:', error);
    return [false, ''];
  }
}
