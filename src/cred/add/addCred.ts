import { Address, Hex } from 'viem';

import { CredManager } from '@phi-hub/sdk';
import { credConfig, credVerifyEndpoint } from '../credConfig';
import { executor, EXECUTOR_PRIVATE_KEY, verifier } from '../../config';
import fs from 'fs';
import path from 'path';
import { createCredRequest } from '../createCredRequest';

interface ProcessResult {
  configId: number;
  credId: number;
}

const credChainId = 8453;

const OUTPUT_FILE = path.join(process.cwd(), 'public/assets/output', `cred_results_${credChainId}.json`);

function loadExistingResults(): ProcessResult[] {
  if (fs.existsSync(OUTPUT_FILE)) {
    const data = fs.readFileSync(OUTPUT_FILE, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

function saveResults(results: ProcessResult[]) {
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${OUTPUT_FILE}`);
}

async function main() {
  const privateKey = EXECUTOR_PRIVATE_KEY as Hex;
  console.log(`Processing executor: ${executor}`);

  const credManager = new CredManager(privateKey, credChainId);
  let results = loadExistingResults();

  for (let configId = 59; configId <= 59; configId++) {
    try {
      console.log(`Processing cred config: ${configId}`);

      const config = credConfig[configId];
      if (!config) {
        console.log(`No config found for configId: ${configId}, skipping.`);
        continue;
      }

      let credCreator = '0x6e4a4525c1b0f9237acc0ab8da9a1934ef75ba94' as Address;
      let credRequest = await createCredRequest(
        configId,
        executor,
        credCreator,
        config.network,
        config.verificationType === 'SIGNATURE' ? verifier : undefined,
        config.verificationType === 'SIGNATURE' ? credVerifyEndpoint[configId] : undefined,
      );

      const credId = await credManager.createCred(credRequest, credChainId);
      console.log(`Successfully processed configId: ${configId} with credID: ${credId}`);

      let result: ProcessResult = { configId, credId };

      // Update or add the result
      const existingIndex = results.findIndex((r) => r.configId === configId);
      if (existingIndex !== -1) {
        results[existingIndex] = result;
      } else {
        results.push(result);
      }

      // Save results after each successful processing
      saveResults(results);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing configId ${configId}:`, error);
      break;
    }
  }
}

main()
  .then(() => console.log('All processing completed.'))
  .catch((error) => console.error('Error in main process:', error));
