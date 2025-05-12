import { CredResult } from '../../../utils/types';
import path from 'path';
import fs from 'fs';

export async function checkPhiLandRank(address: string): Promise<CredResult> {
  try {
    const filePath = path.join(process.cwd(), 'public/data/minter_records.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const minterRecords = JSON.parse(fileData);

    const userRecord = minterRecords[address];
    if (!userRecord || !userRecord.quest) {
      return [false, '0'];
    }

    const questObj = userRecord.quest;

    for (let i = 100175; i >= 100151; i--) {
      if (questObj[i.toString()]) {
        return [true, i.toString()];
      }
    }

    return [false, '0'];
  } catch (error) {
    console.error('Error in checkPhiLandRank:', error);
    return [false, '0'];
  }
}
