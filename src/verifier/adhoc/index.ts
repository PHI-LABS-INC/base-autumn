import { Address } from 'viem';
import { AdhocCredConfig, CredResult } from '../../utils/types';
import { checkTalentScore } from './logic/checkTalentScore';
import { checkCowSwapActivity } from './logic/checkCowSwap';
import { checkRelayBridgeActivity } from './logic/checkRelaytoZero';

export async function handleAdhocCheck(config: AdhocCredConfig, check_address: Address): Promise<CredResult> {
  switch (config.id) {
    case 1: // Cyber Talent Score
      return checkTalentScore(check_address);
    case 2:
      return checkCowSwapActivity(check_address);
    case 3:
      return checkRelayBridgeActivity(check_address);
    default:
      console.error(`Unknown checker id: ${config.id}`);
      return [false, 'Invalid checker configuration'];
  }
}
