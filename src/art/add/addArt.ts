import { Hex } from 'viem';
import { ArtManager } from '@phi-hub/sdk';
import { createArtRequest } from '../createArtRequest';
import { executor, EXECUTOR_PRIVATE_KEY } from '../../config';
import { newSettings } from './newArtConfig';

const artChainId = 8453;
const credChainId = 8453;

async function main() {
  const privateKey = EXECUTOR_PRIVATE_KEY as Hex;
  console.log(`Processing executor: ${executor}`);

  const artManager = new ArtManager(privateKey, artChainId);
  const configId = 7;
  try {
    const artSetting = newSettings[configId];

    if (!artSetting) {
      throw new Error(`No art setting found for configId ${configId}`);
    }

    const baseArtRequest = {
      name: artSetting.name,
      description: artSetting.description,
      externalURL: artSetting.externalURL,
      network: artChainId,
      executor,
      artist: artSetting.artist,
      receiver: artSetting.receiver,
      price: artSetting.price,
      maxSupply: artSetting.maxSupply,
      startDate: artSetting.startDate,
      endDate: artSetting.endDate,
      soulbound: artSetting.soulbound,
    };

    let artRequest;
    if (artSetting.artType === 'IMAGE') {
      artRequest = await createArtRequest({
        ...baseArtRequest,
        imagePath: artSetting.imagePath,
      });
    } else {
      throw new Error(`Unsupported artType`);
    }

    const artId = await artManager.createArt(artRequest, artSetting.credId, credChainId);
    console.log(`Successfully processed createArt for credID: ${artSetting.credId} with artID: ${artId}`);
    console.log(`Art details: Title - ${artSetting.name}, Tags - ${artSetting.tags.join(', ')}`);
  } catch (error) {
    console.error(`Error processing art for configId ${configId}`, error);
    throw error;
  }
}

main()
  .then(() => console.log('Art processing completed.'))
  .catch((error) => {
    console.error('Error in main process:', error);
    process.exit(1);
  });
