import { CredResult } from '../../../utils/types';

type TalentResponse = {
  passport: {
    score: number;
    main_wallet: string;
    verified: boolean;
    verified_wallets: string[];
  };
};

type TalentErrorResponse = {
  error: string;
};

const TALENT_API_KEY = process.env.TALENT_API_KEY;
// Type guard function for error response
function isTalentErrorResponse(data: unknown): data is TalentErrorResponse {
  return typeof data === 'object' && data !== null && 'error' in data && typeof (data as any).error === 'string';
}

// Type guard function for success response
function isTalentResponse(data: unknown): data is TalentResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'passport' in data &&
    typeof (data as any).passport === 'object' &&
    'score' in (data as any).passport &&
    'main_wallet' in (data as any).passport &&
    'verified' in (data as any).passport &&
    'verified_wallets' in (data as any).passport
  );
}

export async function checkTalentScore(address: string): Promise<CredResult> {
  if (!TALENT_API_KEY) {
    throw new Error('Talent API key not provided');
  }
  const response = await fetch(`https://api.talentprotocol.com/api/v2/passports/${address}`, {
    headers: {
      accept: 'application/json',
      'X-API-KEY': TALENT_API_KEY,
    },
  });

  const data: unknown = await response.json();

  // Check for error response
  if (!response.ok) {
    if (response.status === 404 && isTalentErrorResponse(data) && data.error === 'Resource not found.') {
      return [false, ''];
    }
    throw new Error(`Talent Protocol API request failed: ${response.statusText}`);
  }

  if (!isTalentResponse(data)) {
    throw new Error('Invalid response format from Talent Protocol API');
  }

  // Verify the address is the main wallet or in verified wallets
  const normalizedAddress = address.toLowerCase();
  const isVerifiedWallet =
    data.passport.main_wallet.toLowerCase() === normalizedAddress ||
    data.passport.verified_wallets.some((wallet) => wallet.toLowerCase() === normalizedAddress);

  if (!isVerifiedWallet) {
    return [false, 'Address not verified'];
  }

  const score = data.passport.score || 0;
  const meetsScoreRequirement = score >= 10;

  return [meetsScoreRequirement, score.toString()];
}
