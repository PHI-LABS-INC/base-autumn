import 'dotenv/config';
import { txFilter_Any, txFilter_Contract, txFilter_From, txFilter_Standard } from '../verifier/utils/etherscan/filter';
import { CredConfig, EtherscanTxItem } from '../utils/types';
import { ENDPOINT } from '../config';
import { Address, decodeAbiParameters } from 'viem';

const baseSettings = {
  network: 8453,
  startBlock: '0', // eligible network for your cred
  endBlock: 'latest',
  buyShareRoyalty: 0, // buy share royalty 0%
  sellShareRoyalty: 50, // sell royalty 0.5%
  quantity: 1, // initial share quantity
  verificationSource: 'https://github.com/PHI-LABS-INC/base-autumn',
};

export const credConfig: { [key: number]: CredConfig } = {
  0: {
    ...baseSettings,
    title: 'Transact on Base',
    requirement: 'Execute any transaction on Base chain',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY ?? '',
    verificationConfigs: [
      {
        contractAddress: 'any',
        methodId: 'any',
        filterFunction: txFilter_Any,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Base',
    tags: ['Transaction'],
    relatedLinks: ['https://base.org/'],
  },
  1: {
    ...baseSettings,
    title: 'Base Paint Starter',
    requirement: 'Mint a brush to save your art on the canvas',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY2 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0xD68fe5b53e7E1AbeB5A4d0A6660667791f39263a',
        methodId: 'any',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Base Paint',
    tags: ['Transaction', 'Base', 'Art'],
    relatedLinks: [
      'https://basepaint.xyz/brush',
      'https://basescan.org/address/0xD68fe5b53e7E1AbeB5A4d0A6660667791f39263a',
    ],
  },
  2: {
    ...baseSettings,
    title: 'Stryke Options Novice',
    requirement: 'Purchase Option on the Stryke platform',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY3 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x8C4D42ACdAf0dea678B02A092276E2313eD7D820',
        methodId: '0xac9650d8',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Stryke',
    tags: ['DeFi', 'Option'],
    relatedLinks: ['https://www.stryke.xyz/en/dashboard'],
  },
  3: {
    ...baseSettings,
    title: 'Fren Pet Breeder',
    requirement: 'Interact with Fren Pet more than 5 times',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY4 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x0e22B5f3E11944578b37ED04F5312Dfc246f443C',
        methodId: 'any',
        filterFunction: txFilter_Contract,
      },
    ],
    mintEligibility: (result: number) => result > 5,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Fren Pet',
    tags: ['Gaming', 'Pet'],
    relatedLinks: ['https://frenpet.xyz/', 'https://basescan.org/address/0x0e22B5f3E11944578b37ED04F5312Dfc246f443C'],
  },
  4: {
    ...baseSettings,
    title: 'PoolTogether Depositor',
    requirement: 'Deposit USDC into PoolTogether on Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',

    contractAddress: '0x7f5C2b379b88499aC2B997Db583f8079503f25b9',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: '_account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'PoolTogether',
    tags: ['DeFi', 'Savings'],
    relatedLinks: [
      'https://thedapplist.com/project/pool-together',
      'https://app.cabana.fi/vault/8453/0x7f5C2b379b88499aC2B997Db583f8079503f25b9',
    ],
  },
  5: {
    ...baseSettings,
    title: 'Dot Creator',
    requirement: 'Perform an on-chain activity on DOT platform',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY5 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x7b5673B598A71d27a56781271eC5fa05DE216df0',
        methodId: 'any', // 0x72c275a4
        filterFunction: txFilter_Contract,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Dot',
    tags: ['Social', 'Art'],
    relatedLinks: ['https://thedapplist.com/project/dot', 'https://dot.fan/'],
  },
  6: {
    ...baseSettings,
    title: 'Vrbs Token Holder',
    requirement: 'Own at least one Vrbs or Vrbs Vote token',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0xDFb1cd29c4aB6985F1614e0d65782cd136115b6A',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'Vrbs',
    tags: ['NFT'],
    relatedLinks: [
      'https://vrbs.build/vrbs/auction',
      'https://basescan.org/address/0xDFb1cd29c4aB6985F1614e0d65782cd136115b6A',
    ],
  },
  7: {
    ...baseSettings,
    title: 'Paragraph Creator',
    requirement: 'Mint content on paragraph.xyz',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x9Bf9D0D88C1A835F1052Ef0FBa325b35bBea127a',
        methodId: ['0x3a81b8a5'],
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'paragraph',
    tags: ['Content', 'NFT'],
    relatedLinks: ['https://paragraph.xyz/discover/feed/recent/paragraph'],
  },
  8: {
    ...baseSettings,
    title: 'Zora Creator (Base)',
    requirement: 'Create a new collection on Zora on Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY2 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x777777C338d93e2C7adf08D102d45CA7CC4Ed021',
        methodId: '0x0582823a',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Zora',
    tags: ['NFT'],
    relatedLinks: ['https://zora.co/'],
  },
  9: {
    ...baseSettings,
    title: 'Uniswap Dealer (Base)',
    requirement: 'Perform a token swap on Uniswap on Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY3 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
        methodId: '0x3593564c',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Uniswap',
    tags: ['DeFi', 'Swap'],
    relatedLinks: ['https://app.uniswap.org/'],
  },
  10: {
    ...baseSettings,
    title: 'Seamless Depositor',
    requirement: 'Deposit ETH and create a wstETH Leveraged Staking position on Seamless',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY4 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x258730e23cF2f25887Cb962d32Bd10b878ea8a4e',
        methodId: '0xbc157ac1',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Seamless',
    tags: ['DeFi', 'Leverage'],
    relatedLinks: ['https://app.seamlessprotocol.com/#/ilm-details/0x258730e23cF2f25887Cb962d32Bd10b878ea8a4e'],
  },
  11: {
    ...baseSettings,
    title: 'Rainbow Dealer (Base)',
    requirement: 'Perform a token swap on Rainbow on Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY5 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x00000000009726632680FB29d3F7A9734E3010E2',
        methodId: ['0x999b6464', '0x3c2b9a7d', '0x55e4b7be'],
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Rainbow',
    tags: ['Wallet'],
    relatedLinks: ['https://rainbow.me/'],
  },
  12: {
    ...baseSettings,
    title: 'Reserve Protocol Minter (Base)',
    requirement: 'Mint bsdETH token in Reserve Protocol on Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY ?? '',
    verificationConfigs: [
      {
        contractAddress: ['0xe811b62AB97d9370cE2e25F9ceBC904522b81FE1', '0xaA560D5C2Fade67CF6836Ab793e56A79F09d4282'],
        methodId: ['0xdd074ea0', '0x8e0a8e9d'],
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Reserve',
    tags: ['DeFi', 'Stablecoin', 'Reserve'],
    relatedLinks: [
      'https://thedapplist.com/project/reserve',
      'https://app.reserve.org/base/token/0xcb327b99ff831bf8223cced12b1338ff3aa322ff/overview',
      'https://basescan.org/address/0xe811b62ab97d9370ce2e25f9cebc904522b81fe1',
    ],
  },
  13: {
    ...baseSettings,
    title: 'Aerodrome Pooler (Base)',
    requirement: 'Add liquidity to a pool on Aerodrome on Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY2 ?? '',
    verificationConfigs: [
      {
        contractAddress: ['0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43', '0x827922686190790b37229fd06084350E74485b72'],
        methodId: ['0xb7e0d4c0', '0x5a47ddc3', '0xb5007d1f'],
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Aerodrome',
    tags: ['DeFi', 'Liquidity'],
    relatedLinks: [
      'https://aerodrome.finance/pools',
      'https://basescan.org/address/0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43',
    ],
  },
  14: {
    ...baseSettings,
    title: 'Brett Token Holder',
    requirement: 'Own at least one Brett Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0x532f27101965dd16442E59d40670FaF5eBB142E4',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'Brett',
    tags: ['Token', 'Holder'],
    relatedLinks: [
      'https://www.basedbrett.com/',
      'https://basescan.org/address/0x532f27101965dd16442e59d40670faf5ebb142e4#readContract',
    ],
  },
  15: {
    ...baseSettings,
    title: 'Higher Token Holder',
    requirement: 'Own at least one Higher Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0x0578d8a44db98b23bf096a382e016e29a5ce0ffe',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'Higher',
    tags: ['Token', 'Holder'],
    relatedLinks: ['https://basescan.org/token/0x0578d8a44db98b23bf096a382e016e29a5ce0ffe'],
  },
  16: {
    ...baseSettings,
    title: 'Verified Farcaster User',
    requirement: 'Check if the address is verified on Farcaster',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'neynar',
    apiKey: process.env.NEYNAR_API_KEY ?? '',
    endpoint: 'https://api.neynar.com/v1/farcaster/user-by-verification',
    project: 'Farcaster',
    tags: ['Social', 'SNS'],
    relatedLinks: ['https://www.farcaster.xyz/'],
  },
  17: {
    ...baseSettings,
    title: 'Extra Finance Farmer (Base)',
    requirement: 'Create a leveraged farming position on Extra Finance on Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY2 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0xf9cFB8a62f50e10AdDE5Aa888B44cF01C5957055',
        methodId: '0x4dbe83ed',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Extra Finance',
    tags: ['DeFi', 'Farming', 'Leverage'],
    relatedLinks: ['https://app.extrafi.io/farm'],
  },
  18: {
    ...baseSettings,
    title: 'Yellow Collective Bidder',
    requirement: 'Place a bid on Yellow Collective platform',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY3 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x0aa23A7E112889C965010558803813710beCF263',
        methodId: ['0x659dd2b4', '0xc0d5bb8b'],
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Yellow Collective',
    tags: ['NFT', 'Auction'],
    relatedLinks: ['https://www.yellowcollective.xyz/'],
  },
  19: {
    ...baseSettings,
    title: 'Mint Why Phi',
    requirement: 'Mint a Why Phi token on Phi protocol',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY4 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0xc649989246FAa59bBefA7c65551cc4461E823320',
        methodId: '0x6a627842',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Phi',
    tags: ['NFT', 'Content'],
    relatedLinks: [
      'https://thedapplist.com/project/phi',
      'https://phiprotocol.xyz/',
      'https://basescan.org/address/0xc649989246faa59bbefa7c65551cc4461e823320',
    ],
  },
  20: {
    ...baseSettings,
    title: 'Deposit USDC in Moonwell Flagship (Base)',
    requirement: 'Deposit USDC into Moonwell Flagship on Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY5 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca',
        methodId: '0x6e553f65',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Moonwell',
    tags: ['DeFi', 'Lending'],
    relatedLinks: [
      'https://thedapplist.com/project/moonwell',
      'https://moonwell.fi/vaults/deposit/base/mwusdc',
      'https://basescan.org/address/0x5037e7747faa78fc0ecf8dfc526dcd19f73076ce',
    ],
  },
  21: {
    ...baseSettings,
    title: 'Avantis Trader',
    requirement: 'Execute a trade on Avantis platform',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x5FF292d70bA9cD9e7CCb313782811b3D7120535f',
        methodId: '0xf5567637',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Avantis',
    tags: ['DeFi', 'Trading'],
    relatedLinks: ['https://www.avantisfi.com/trade'],
  },
  22: {
    ...baseSettings,
    title: 'Cygnus Finance Minter',
    requirement: 'Mint cgUSD token on CYGNUS FINANCE platform',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY2 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0xCa72827a3D211CfD8F6b00Ac98824872b72CAb49',
        methodId: '0x40c10f19',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'CYGNUS FINANCE',
    tags: ['DeFi'],
    relatedLinks: [
      'https://app.cygnus.finance/mint',
      'https://basescan.org/tx/0x5fc2bfc66eb2c44e1e2ab2ea89479552f7f8b99c61de2afba7efdbe113b303bd',
    ],
  },
  23: {
    ...baseSettings,
    title: 'BUILD Token Holder',
    requirement: 'Own at least one BUILD Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0x3c281a39944a2319aa653d81cfd93ca10983d234',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'BUILD Token',
    tags: ['Token', 'Holder'],
    relatedLinks: ['https://www.build.top/', 'https://basescan.org/token/0x3c281a39944a2319aa653d81cfd93ca10983d234'],
  },
  24: {
    ...baseSettings,
    title: 'SushiSwap Dealer (Base)',
    requirement: 'Perform a token swap on SushiSwap on Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY3 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0xf2614A233c7C3e7f08b1F887Ba133a13f1eb2c55', // SushiSwap Router contract on Base
        methodId: '0x6678ec1f', // This is the method ID for processRouteWithTransferValueOutput
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'sushiswap',
    tags: ['DeFi', 'Swap'],
    relatedLinks: ['https://thedapplist.com/project/sushiswap', 'https://www.sushi.com/swap?chainId=8453'],
  },
  25: {
    ...baseSettings,
    title: 'Aave Supporter (Base)',
    requirement: 'Supply assets to Aave v3 lending pool on Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY4 ?? '',
    verificationConfigs: [
      {
        contractAddress: [
          '0x729b3EA8C005AbC58c9150fb57Ec161296F06766',
          '0x8be473dCfA93132658821E67CbEB684ec8Ea2E74',
          '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
        ],
        methodId: ['0x474cf53d', '0x617ba037'],
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'aave',
    tags: ['DeFi', 'Lending'],
    relatedLinks: [
      'https://thedapplist.com/project/aave-1',
      'https://app.aave.com/?marketName=proto_base_v3',
      'https://basescan.org/address/0x8be473dCfA93132658821E67CbEB684ec8Ea2E74',
      'https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
    ],
  },
  26: {
    ...baseSettings,
    title: 'Degen Token Holder',
    requirement: 'Own at least one Degen Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'Degen',
    tags: ['Token', 'Degen'],
    relatedLinks: [
      'https://thedapplist.com/project/degen',
      'https://basescan.org/token/0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      'https://www.degen.tips/',
    ],
  },
  27: {
    ...baseSettings,
    title: 'Verified Basename',
    requirement: 'Basenames: Register a human-readable name for your wallet address',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY5 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a5',
        methodId: ['0xc7c79676', '0xe0093eda'],
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Base',
    tags: ['Base'],
    relatedLinks: ['https://thedapplist.com/project/base-name-service', 'https://www.base.org/names'],
  },
  28: {
    ...baseSettings,
    title: 'Highlight Minter',
    requirement: 'Mint NFTs on Highlight.xyz platform',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY ?? '',
    verificationConfigs: [
      {
        contractAddress: [
          '0xd9E58978808d17F99ccCEAb5195B052E972c0188',
          '0x481f9289257795bbC5Cc9bab8c986D3377450331',
          '0x8087039152c472Fa74F47398628fF002994056EA',
        ], // Highlight.xyz contract address
        methodId: ['0x02c3a65b', '0xcdacf467', '0x23bc2078'], // mint function method ID
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Highlight',
    tags: ['NFT', 'Minting'],
    relatedLinks: ['https://highlight.xyz/'],
  },
  29: {
    ...baseSettings,
    title: 'Shaka Token Holder',
    requirement: 'Own at least one Shaka Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0x478e03D45716dDa94F6DbC15A633B0D90c237E2F',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'Shaka',
    tags: ['Token', 'Shaka'],
    relatedLinks: [
      'https://basescan.org/token/0x478e03D45716dDa94F6DbC15A633B0D90c237E2F',
      'https://app.uniswap.org/swap?outputCurrency=0x478e03D45716dDa94F6DbC15A633B0D90c237E2F&chain=base',
    ],
  },
  30: {
    ...baseSettings,
    title: 'Fren Pet Daily Feeder',
    requirement: 'Feed your pet to extend its life',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY2 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x0e22B5f3E11944578b37ED04F5312Dfc246f443C',
        methodId: '0x715488b0',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase() && checkItemIdZero(tx)).length,
    project: 'Fren Pet',
    tags: ['Gaming', 'Pet'],
    relatedLinks: [
      'https://thedapplist.com/project/fren-pet',
      'https://frenpet.xyz/',
      'https://basescan.org/address/0x0e22B5f3E11944578b37ED04F5312Dfc246f443C',
    ],
  },
  31: {
    ...baseSettings,
    title: 'Dot Painter on Base (Last 1000 Blocks)',
    requirement: 'Perform Publish and Collect Dot Card on Dot platform within the last 1000 blocks on Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY3 ?? '',
    verificationConfigs: [
      {
        from: '0xf35365763a881475f4c1ba4ad8e41f6078011bda',
        contractAddress: '0x7b5673B598A71d27a56781271eC5fa05DE216df0',
        methodId: '0x9c1a1c4d',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => checkDotCollector(tx, address as Address)).length,
    project: 'Dot',
    tags: ['Social', 'Art'],
    relatedLinks: ['https://thedapplist.com/project/dot', 'https://dot.fan/'],
  },
  32: {
    ...baseSettings,
    title: 'Safe Deployer',
    requirement: 'Deploy a Safe Smart Account on the Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY4 ?? '',
    verificationConfigs: [
      {
        contractAddress: [
          '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67',
          '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB21',
          '0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC',
        ],
        methodId: [
          '0x61b69abd', // createProxyWithNonce
          '0x1688f0b9', // createProxy
        ],
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Safe',
    tags: ['Safe', 'Wallet', 'Smart Account'],
    relatedLinks: ['https://app.safe.global/'],
  },
  33: {
    ...baseSettings,
    title: 'Submit Result on Speedtracer',
    requirement: 'Submit a result on the Speedtracer platform',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY5 ?? '',
    verificationConfigs: [
      {
        contractAddress: ['0xCD45E55DB12E9CA3E82370F5D0c5C6876bF6f466', '0xF803F5E6072f469AB36CE365F9e7dE6C595f3484'],
        methodId: ['0x72c275a4'],
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Speedtracer',
    tags: ['Gaming'],
    relatedLinks: [
      'https://www.speedtracer.xyz/',
      'https://basescan.org/address/0xCD45E55DB12E9CA3E82370F5D0c5C6876bF6f466',
    ],
  },
  34: {
    ...baseSettings,
    title: 'Owlto Finance Bridger/Swapper',
    requirement:
      'Bridge assets to Base using Owlto Finance within the last 1000 trancasciton or perform a swap on Owlto Finance',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY ?? '',
    verificationConfigs: [
      {
        from: '0x5e809A85Aa182A9921EDD10a4163745bb3e36284',
        contractAddress: 'any',
        methodId: '0xa9059cbb',
        filterFunction: txFilter_Any,
      },
      {
        contractAddress: '0x89d43d991F47924Dd47C9b6a7Fa17C6a15091999',
        methodId: '0xbff25ca2',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter(
        (tx) => tx.to.toLowerCase() === address.toLowerCase() || tx.from.toLowerCase() === address.toLowerCase(),
      ).length,
    project: 'Owlto finance',
    tags: ['DeFi', 'Bridge'],
    relatedLinks: ['https://owlto.finance/'],
  },
  35: {
    ...baseSettings,
    title: 'Cake Token Holder',
    requirement: 'Own at least one Cake Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY3 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0xFE6508f0015C778Bdcc1fB5465bA5ebE224C9912',
        methodId: '0x3593564c',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Pancake Swap',
    tags: ['Token', 'Holder', 'Pancake'],
    relatedLinks: [
      'https://thedapplist.com/project/pancake-swap',
      'https://pancakeswap.finance/?chain=base&outputCurrency=0x3055913c90Fcc1A6CE9a358911721eEb942013A1',
      'https://basescan.org/address/0x3055913c90Fcc1A6CE9a358911721eEb942013A1',
    ],
  },
  36: {
    ...baseSettings,
    title: 'Stargate Traveler',
    requirement: 'Bridge ETH/USDC through the Stargate to Base network',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY4 ?? '',
    verificationConfigs: [
      {
        type: 'txlistinternal',
        from: '0xdc181bd607330aeebef6ea62e03e5e1fb4b6f7c7',
        contractAddress: '0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7',
        methodId: '0xcfc32570',
        filterFunction: txFilter_From,
      },
      {
        type: 'tokentx',
        from: '0x27a16dc786820B16E5c9028b75B99F6f604b5d26',
        contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        methodId: 'any',
        filterFunction: txFilter_From,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.to.toLowerCase() === address.toLowerCase()).length,
    project: 'Stargate Finance',
    tags: ['Bridge', 'DeFi'],
    relatedLinks: ['https://stargate.finance/bridge'],
  },
  37: {
    ...baseSettings,
    title: 'Coinbase Wrapped BTC Holder',
    requirement: 'Own at least one Coinbase Wrapped BTC',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'cbBTC',
    tags: ['Token', 'cbBTC'],
    relatedLinks: [
      'https://basescan.org/token/0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
      'https://app.uniswap.org/swap?outputCurrency=0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf&chain=base',
    ],
  },
  38: {
    ...baseSettings,
    title: 'Morpho Explorer',
    requirement: 'Create a position on Morpho platform',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY5 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x23055618898e202386e6c13955a58D3C68200BFB',
        methodId: '0xac9650d8',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'Morpho',
    tags: ['Morpho', 'DeFi'],
    relatedLinks: [
      'https://app.morpho.org/?network=base',
      'https://basescan.org/address/0x23055618898e202386e6c13955a58d3c68200bfb',
    ],
  },
  39: {
    ...baseSettings,
    title: 'Luna Token Holder',
    requirement: 'Own at least one Luna Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0x55cd6469f597452b5a7536e2cd98fde4c1247ee4',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'Virtuals',
    tags: ['Token', 'Luna'],
    relatedLinks: [
      'https://app.virtuals.io/virtuals/68F',
      'https://kyberswap.com/swap/base/eth-to-luna',
      'https://medium.com/@dpycm/novilunium-oritur-8ec7f020a76f',
      'https://basescan.org/address/0x55cd6469f597452b5a7536e2cd98fde4c1247ee4',
    ],
  },
  40: {
    ...baseSettings,
    title: 'Sound Listener on Base',
    requirement: 'Own at least one Sound Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x000000000001A36777f9930aAEFf623771b13e70',
        methodId: '0x4a04a1c9',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'sound-xyz',
    tags: ['Music', 'sound-xyz'],
    relatedLinks: ['https://thedapplist.com/project/sound-xyz', 'https://www.sound.xyz/'],
  },
  41: {
    ...baseSettings,
    title: 'KlimaDAO Token Holder on Base',
    requirement: 'Own at least one KlimaDAO Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0xDCEFd8C8fCc492630B943ABcaB3429F12Ea9Fea2',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'klima-dao',
    tags: ['DeFi', 'klima-dao'],
    relatedLinks: [
      'https://base.klimadao.finance/',
      'https://thedapplist.com/project/klima-dao',
      'https://aerodrome.finance/swap?from=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&to=0xdcefd8c8fcc492630b943abcab3429f12ea9fea2',
    ],
  },
  42: {
    ...baseSettings,
    title: 'VIRTUAL Token Holder',
    requirement: 'Own at least one VIRTUAL Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'Virtuals',
    tags: ['Token', 'Virtuals'],
    relatedLinks: [
      'https://app.virtuals.io/virtuals/',
      'https://aerodrome.finance/swap?from=eth&to=0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b',
    ],
  },
  43: {
    ...baseSettings,
    title: 'Limitless Vote Winner & Redeemer',
    requirement: 'Vote in Limitless governance, win, and redeem rewards',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY2 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0xC9c98965297Bc527861c898329Ee280632B76e18',
        methodId: '0x01b7037c',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'limitless',
    tags: ['limitless'],
    relatedLinks: ['https://limitless.exchange/', 'https://x.com/trylimitless'],
  },
  44: {
    ...baseSettings,
    title: 'box Domain Pioneer',
    requirement: 'Register and purchase your own .box domain name',
    network: 10,
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.OPTIMISM_API_KEY ?? '',
    verificationConfigs: [
      {
        contractAddress: '0xBB7B805B257d7C76CA9435B3ffe780355E4C4B17',
        methodId: '0xac9650d8',
        filterFunction: txFilter_Standard,
      },
      {
        contractAddress: '0xBB7B805B257d7C76CA9435B3ffe780355E4C4B17',
        methodId: '0xac9650d8',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'box',
    tags: ['box'],
    relatedLinks: ['https://my.box/?ref=phiprotocol', 'https://docs.my.box/docs', 'https://x.com/boxdomains'],
  },
  45: {
    ...baseSettings,
    title: 'Aether Token Holder',
    requirement: 'Own at least one Aether Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0xF3708859C178709d5319ad5405Bc81511B72b9e9',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'Aether',
    tags: ['Token', 'Aether'],
    relatedLinks: [
      'https://warpcast.com/aethernet',
      'https://app.uniswap.org/explore/tokens/base/0xf3708859c178709d5319ad5405bc81511b72b9e9',
    ],
  },
  46: {
    ...baseSettings,
    title: 'Collective Nouns Holder',
    requirement: 'Own at least one Collective Nouns token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0x220e41499CF4d93a3629a5509410CBf9E6E0B109',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'Yellow Collective',
    tags: ['NFT', 'Nouns'],
    relatedLinks: [
      'https://www.yellowcollective.xyz/',
      'https://opensea.io/collection/collective-nouns',
      'https://basescan.org/address/0x0aa23a7e112889c965010558803813710becf263',
    ],
  },
  47: {
    ...baseSettings,
    title: 'aixbt Token Holder',
    requirement: 'Own at least one aixbt Token',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0x4f9fd6be4a90f2620860d680c0d4d5fb53d1a825',
    functionName: 'balanceOf',
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    contractCallCondition: (result: number) => result > 0,
    project: 'Virtuals',
    tags: ['Token', 'aixbt'],
    relatedLinks: [
      'https://x.com/aixbt_agent',
      'https://app.virtuals.io/virtuals/1199',
      'https://dexscreener.com/base/0x7464850cc1cfb54a2223229b77b1bca2f888d946',
      'https://aixbt.tech/',
    ],
  },
  48: {
    ...baseSettings,
    title: 'Verified Talent Protocol User',
    requirement: 'Verify if the address has a valid Talent Protocol passport with score',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'adhoc',
    id: 1,
    project: 'Talent Protocol',
    tags: ['Talent Protocol', 'Identity', 'Score'],
    relatedLinks: ['https://www.talentprotocol.com/'],
  },
  49: {
    ...baseSettings,
    title: 'Base CowSwap Trader',
    requirement: 'Verify if the address has executed trades on CowSwap Base',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    apiChoice: 'adhoc',
    id: 2,
    project: 'CowSwap',
    tags: ['CowSwap', 'DEX', 'Trading', 'Base'],
    relatedLinks: ['https://swap.cow.fi/#/8453/swap'],
  },
  50: {
    ...baseSettings,
    title: 'Ethereum Follow Protocol Explorer',
    requirement: 'Follow a wallet on Base using Follow Protocol',
    credType: 'BASIC',
    verificationType: 'SIGNATURE',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.BASESCAN_API_KEY3 ?? '',
    verificationConfigs: [
      {
        contractAddress: '0x41Aa48Ef3c0446b46a5b1cc6337FF3d3716E2A33',
        methodId: '0x6fcab637',
        filterFunction: txFilter_Standard,
      },
    ],
    mintEligibility: (result: number) => result > 0,
    transactionCountCondition: (txs: any[], address: string) =>
      txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase()).length,
    project: 'ethereum follow protocol',
    tags: ['SNS', 'ethereum follow protocol'],
    relatedLinks: ['https://ethfollow.xyz/'],
  },
};

export const credVerifyEndpoint: { [key: number]: string } = Object.fromEntries(
  Object.keys(credConfig).map((key) => [key, `https://${ENDPOINT}/api/verify/${key}`]),
);

const checkItemIdZero = (tx: EtherscanTxItem): boolean => {
  if (tx.methodId === '0x715488b0' && tx.input.length >= 74) {
    const inputData = '0x' + tx.input.slice(10);
    const [, itemId] = decodeAbiParameters([{ type: 'uint256' }, { type: 'uint256' }], inputData as `0x${string}`);
    return BigInt(itemId) === BigInt(0);
  }
  return false;
};

const checkDotCollector = (tx: EtherscanTxItem, address: Address): boolean => {
  const inputData = '0x' + tx.input.slice(10);
  const [collector] = decodeAbiParameters(
    [{ type: 'address' }, { type: 'string' }, { type: 'string' }],
    inputData as `0x${string}`,
  );
  return collector.toLowerCase() === address.toLowerCase();
};
