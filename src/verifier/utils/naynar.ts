import { CredResult, NeynarCredConfig } from '../../utils/types';

type NeynarBulkResponse = {
  [address: string]: {
    object: string;
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
    custody_address: string;
    profile: {
      bio: {
        text: string;
      };
    };
    follower_count: number;
    following_count: number;
    verifications: string[];
    verified_addresses: {
      eth_addresses: string[];
      sol_addresses: string[];
      primary: {
        eth_address: string | null;
        sol_address: string | null;
      };
    };
    verified_accounts: {
      platform: string;
      username: string;
    }[];
    power_badge: boolean;
  }[];
};

// Type guard function to check if the data matches the new NeynarBulkResponse structure
function isNeynarBulkResponse(data: unknown, address: string): data is NeynarBulkResponse {
  if (typeof data !== 'object' || data === null) return false;

  // Check if the lowercase address exists as a key in the response
  const addressKey = address.toLowerCase();
  return (
    addressKey in data &&
    Array.isArray((data as any)[addressKey]) &&
    (data as any)[addressKey].length > 0 &&
    'verifications' in (data as any)[addressKey][0] &&
    Array.isArray((data as any)[addressKey][0].verifications)
  );
}

export async function handleNeynarCheck(config: NeynarCredConfig, address: string): Promise<CredResult> {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}&address_types=`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-neynar-experimental': 'false',
      'x-api-key': config.apiKey,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [false, ''];
    }
    throw new Error(`Neynar API request failed: ${response.statusText}`);
  }

  const data: unknown = await response.json();
  const addressLower = address.toLowerCase();

  if (!isNeynarBulkResponse(data, addressLower)) {
    throw new Error('Invalid response format from Neynar API');
  }

  // Get the user data for the address
  const userData = data[addressLower][0];

  // Check if the address is in the verifications array
  const isVerified = userData.verifications.includes(addressLower);

  if (config.credType === 'ADVANCED') {
    return [isVerified, isVerified ? 'Verified' : 'Not Verified'];
  } else {
    return [isVerified, ''];
  }
}
