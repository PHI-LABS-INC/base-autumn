import { CredResult } from '../../../utils/types';
import { Address } from 'viem';
import { mainnet } from 'viem/chains';
import { createPublicClientForNetwork } from '../../utils/contractCall';

const ContractABI = ['function hasClaimed(address,uint8) view returns (uint)'] as const;
const getWawaAddress = '0xcd49c434299872218a03875de2004e708b973918' as Address;

export async function checkMechaWawa(address: string): Promise<CredResult> {
  try {
    // Ethereum mainnetのpublicClientを作成
    const publicClient = await createPublicClientForNetwork(mainnet);

    // コントラクトのhasClaimed関数を呼び出し
    const result = await publicClient.readContract({
      address: getWawaAddress,
      abi: ContractABI,
      functionName: 'hasClaimed',
      args: [address as Address, 2], // uint8に3を指定
    });

    // resultはuint型なので、0以外ならtrueと判定
    const hasClaimed = Number(result) > 0;

    return [hasClaimed, hasClaimed ? '1' : '0'];
  } catch (error) {
    console.error('Error checking Wawa claimed status:', error);
    // エラーが発生した場合はfalseを返す
    return [false, '0'];
  }
}
