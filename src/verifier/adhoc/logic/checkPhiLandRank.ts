import { CredResult } from '../../../utils/types';

export async function checkPhiLandRank(address: string): Promise<CredResult> {
  try {
    // Import the minter_records.json file
    const minterRecords = require('./data/minter_records.json');

    // Check if the address exists in the records
    if (!minterRecords[address]) {
      return [false, '0'];
    }

    // Get the quest object for this address
    const questObj = minterRecords[address].quest;
    if (!questObj) {
      return [false, '0'];
    }

    // Find the highest quest number between 100151 and 100175
    let highestQuestNumber = 0;
    for (let i = 100151; i <= 100175; i++) {
      if (questObj[i.toString()] === true) {
        highestQuestNumber = i;
      }
    }

    // If we found a valid quest number, return true and the number
    if (highestQuestNumber > 0) {
      return [true, highestQuestNumber.toString()];
    }

    // No valid quest number found
    return [false, '0'];
  } catch (error) {
    console.error('Error in checkPhiLandRank:', error);
    return [false, '0'];
  }
}
