import 'dotenv/config';
import path from 'path';
import { Season0endDate, Season1endDate } from '../../utils/data';
import { ArtSettingToCred } from '../../utils/types';

const baseSettings = {
  price: 0,
  maxSupply: undefined,
  soulbound: false,
  startDate: Math.floor(Date.now() / 1000),
  endDate: Season0endDate,
  artType: 'IMAGE' as const,
};

export const newSettings: { [key: number]: ArtSettingToCred } = {
  0: {
    ...baseSettings,
    credId: 28,
    name: 'Call me Bob.base',
    description:
      'A snuggly monster spreads love and warmth, representing the inclusive and friendly vibe of the base ecosystem.',
    tags: ['Base', 'BaseName', 'Josiah'],
    externalURL: 'https://www.base.org/names',
    imagePath: path.join(process.cwd(), 'public/assets/images/prod/new', '0.webp'),
    artist: '0x7b74954a57ed60b8136e340aa4b937919005f507',
    receiver: '0x7b74954a57ed60b8136e340aa4b937919005f507',
  },
  1: {
    ...baseSettings,
    credId: 20,
    name: 'Harmony in Chroma',
    description: 'Harmony in Chroma is a digital art where beauty and logic entwine.',
    tags: ['Base', 'Phi', 'Josiah'],
    externalURL: 'https://phi.box',
    imagePath: path.join(process.cwd(), 'public/assets/images/prod/new', '1.jpg'),
    artist: '0x7b74954a57ed60b8136e340aa4b937919005f507',
    receiver: '0x7b74954a57ed60b8136e340aa4b937919005f507',
  },
  2: {
    ...baseSettings,
    credId: 17,
    name: 'Farcaster Unbound',
    description:
      "Farcaster's hero embodies the unstoppable force of free expression, soaring through the city to defend the right to speak freely and challenge the status quo. This vibrant artwork captures the essence of decentralization and the unrelenting pursuit of truth.",
    tags: ['Base', 'Josiah', 'farcaster'],
    externalURL: 'https://www.farcaster.xyz/',
    imagePath: path.join(process.cwd(), 'public/assets/images/prod/new', '2.jpg'),
    artist: '0x7b74954a57ed60b8136e340aa4b937919005f507',
    receiver: '0x7b74954a57ed60b8136e340aa4b937919005f507',
  },
  3: {
    ...baseSettings,
    credId: 40,
    name: 'Pancake Frenzy',
    description:
      'Vibrant pancakes soar through the air, capturing the energetic essence of a thriving decentralized exchange on Base.',
    tags: ['Base', 'Josiah', 'Pancake'],
    externalURL: 'https://thedapplist.com/project/pancake-swap',
    imagePath: path.join(process.cwd(), 'public/assets/images/prod/new', '3.webp'),
    artist: '0x7b74954a57ed60b8136e340aa4b937919005f507',
    receiver: '0x7b74954a57ed60b8136e340aa4b937919005f507',
  },
  4: {
    ...baseSettings,
    credId: 1,
    name: 'The Base Enthusiast',
    description:
      'A bird eagerly shares their love for Base, enthusiastic about its potential to empower decentralized innovation.',
    tags: ['Base', 'Josiah'],
    externalURL: 'https://base.org/',
    imagePath: path.join(process.cwd(), 'public/assets/images/prod/new', '4.png'),
    artist: '0x7b74954a57ed60b8136e340aa4b937919005f507',
    receiver: '0x7b74954a57ed60b8136e340aa4b937919005f507',
  },
  5: {
    ...baseSettings,
    credId: 41,
    name: 'Stargate Portal',
    description: 'The portal to infinite possibilities open.',
    tags: ['Base', 'Stargate Finance', 'Josiah'],
    externalURL: 'https://stargate.finance/bridge',
    imagePath: path.join(process.cwd(), 'public/assets/images/prod/new', '5.webp'),
    artist: '0x7b74954a57ed60b8136e340aa4b937919005f507',
    receiver: '0x7b74954a57ed60b8136e340aa4b937919005f507',
  },
  6: {
    ...baseSettings,
    credId: 102,
    name: 'Phi × eBoy: Base 2025 Portal',
    description:
      'A pixelated structure bridging φ’s timeless ratio, eBoy’s iconic isometric flair, and the dynamic horizon of Base in 2025. Step through and discover a new dimension.',
    tags: ['Base', 'eboy', '2025'],
    endDate: Season1endDate,
    externalURL: 'https://base.org/',
    imagePath: path.join(process.cwd(), 'public/assets/images/prod/new', '6.gif'),
    artist: '0x8869e7b48e33c5f1fffb0f15f6084c7b438d6371',
    receiver: '0xEc431285f14f7D9cE451ff7F4BBCE0Bc5659Ce31',
  },
  7: {
    ...baseSettings,
    credId: 110,
    name: 'Chinese New Year Festival 2025',
    description:
      'A pixelated celebration of Chinese New Year on Base, marking the start of the lunisolar calendar year. This isometric artwork features traditional red lanterns and festive structures that symbolize the transition from winter to spring during the Spring Festival.',
    tags: ['Base', 'eboy', '2025'],
    endDate: Season1endDate,
    externalURL: 'https://base.org/',
    imagePath: path.join(process.cwd(), 'public/assets/images/prod/new', '7.png'),
    artist: '0x8869e7b48e33c5f1fffb0f15f6084c7b438d6371',
    receiver: '0xEc431285f14f7D9cE451ff7F4BBCE0Bc5659Ce31',
  },
};
