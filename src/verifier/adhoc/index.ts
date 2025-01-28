import { Address } from 'viem';
import { AdhocCredConfig, CredResult } from '../../utils/types';
import { checkTalentScore } from './logic/checkTalentScore';
import { checkCowSwapActivity } from './logic/checkCowSwap';
import { checkRelayBridgeActivity } from './logic/checkRelaytoZero';
import { checkBase3am } from './logic/checkBase3am';
import { checkBase2025 } from './logic/checkBase2025';
import { checkJokeraceVote } from './logic/checkJokeRace';

export async function handleAdhocCheck(config: AdhocCredConfig, check_address: Address): Promise<CredResult> {
  switch (config.id) {
    case 1: // Cyber Talent Score
      return checkTalentScore(check_address);
    case 2:
      return checkCowSwapActivity(check_address);
    case 3:
      return checkRelayBridgeActivity(check_address);
    case 4:
      return checkBase3am(check_address);
    case 5:
      return checkBase2025(check_address);
    case 6:
      return checkJokeraceVote(check_address);
    default:
      console.error(`Unknown checker id: ${config.id}`);
      return [false, 'Invalid checker configuration'];
  }
}
