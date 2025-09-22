import { CredResult } from '../../../utils/types';
import { Address } from 'viem';
import { mainnet } from 'viem/chains';
import { createPublicClientForNetwork } from '../../utils/contractCall';

// Standard ABI object format - more reliable than human-readable format
const ContractABI = [
  {
    type: 'function',
    name: 'hasClaimed',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'factionId', type: 'uint8' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

const getWawaAddress = '0xcd49c434299872218a03875de2004e708b973918' as Address;

export async function checkMechaWawa(address: string): Promise<CredResult> {
  try {
    // アドレスの妥当性チェック
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return [false, ''];
    }

    // Ethereum mainnetのpublicClientを作成
    const publicClient = await createPublicClientForNetwork(mainnet);

    // コントラクトのhasClaimed関数を呼び出し
    const result = await publicClient.readContract({
      address: getWawaAddress,
      abi: ContractABI,
      functionName: 'hasClaimed',
      args: [address as Address, 2], // uint8に2を指定 (Mecha faction)
    });

    console.log(`hasClaimed result for ${address}:`, result);

    // resultはuint型なので、0以外ならtrueと判定
    const hasClaimed = Number(result) > 0;

    // テストの期待値に合わせて調整
    if (hasClaimed) {
      return [true, ''];
    } else {
      // 0が返された場合（クレームしていない）は空文字列を返す
      return [false, ''];
    }
  } catch (error) {
    console.error('Error checking Wawa claimed status:', error);
    // エラーが発生した場合はfalseを返す
    return [false, ''];
  }
}
