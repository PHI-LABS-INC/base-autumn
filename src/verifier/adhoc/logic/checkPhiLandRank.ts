import { CredResult } from '../../../utils/types';
import minterRecords from './data/minter_records.json';

export async function checkPhiLandRank(address: string): Promise<CredResult> {
  try {
    // Check if the address exists
    const userRecord = minterRecords[address];
    if (!userRecord || !userRecord.quest) {
      return [false, '0'];
    }

    const questObj = userRecord.quest;
    const questRangeStart = 100151;
    const questRangeEnd = 100175;

    // Find the highest quest number completed within the specified range
    for (let i = questRangeEnd; i >= questRangeStart; i--) {
      if (questObj[i.toString()]) {
        return [true, i.toString()];
      }
    }

    // No valid quest number found
    return [false, '0'];
  } catch (error) {
    console.error('Error in checkPhiLandRank:', error);
    return [false, '0'];
  }
}
