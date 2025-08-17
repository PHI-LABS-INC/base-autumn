import { Address } from 'viem';
import { AdhocCredConfig, CredResult } from '../../utils/types';
import { checkTalentScore } from './logic/checkTalentScore';
import { checkCowSwapActivity } from './logic/checkCowSwap';
import { checkRelayBridgeActivity } from './logic/checkRelaytoZero';
import { checkBase3am } from './logic/checkBase3am';
import { checkBase2025 } from './logic/checkBase2025';
import { checkJokeraceVote } from './logic/checkJokeRace';
import { checkBaseSpringFestival } from './logic/checkBaseSpringFestival';
import { checkBase1000 } from './logic/checkBase1000';
import { checkPhiLandRank } from './logic/checkPhiLandRank';
import { checkUniLiq1weekHold } from './logic/checkUniLiq1weekHold';
import { checkDeploySuccess } from './logic/checkUniV4DeploySuccess';
import { checkPrimaWawa } from './logic/checkPrimaWawa';
import { checkZookWawa } from './logic/checkZookWawa';
import { checkMechaWawa } from './logic/checkMechaWawa';
import { checkFlavoWawa } from './logic/checkFlavoWawa';

export async function handleAdhocCheck(config: AdhocCredConfig, check_address: Address): Promise<CredResult> {
  switch (config.id) {
    case 1:
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
    case 7:
      return checkBaseSpringFestival(check_address);
    case 8:
      return checkBase1000(check_address);
    case 9:
      return checkPhiLandRank(check_address);
    case 10:
      return [true, ''];
    case 11:
      return checkUniLiq1weekHold(check_address);
    case 12:
      return checkDeploySuccess(check_address);
    case 13:
      return checkPrimaWawa(check_address);
    case 14:
      return checkZookWawa(check_address);
    case 15:
      return checkMechaWawa(check_address);
    case 16:
      return checkFlavoWawa(check_address);
    default:
      console.error(`Unknown checker id: ${config.id}`);
      return [false, 'Invalid checker configuration'];
  }
}
