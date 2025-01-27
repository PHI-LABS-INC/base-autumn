import { CredResult } from '../../../utils/types';

type CowSwapOrder = {
  creationDate: string;
  owner: string;
  status: string;
  executedBuyAmount: string;
  executedSellAmount: string;
  buyToken: string;
  sellToken: string;
};

type CowSwapResponse = CowSwapOrder[];

// Type guard function for success response
function isCowSwapResponse(data: unknown): data is CowSwapResponse {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return true; // Empty array is valid
  return data.every(
    (order) =>
      typeof order === 'object' &&
      order !== null &&
      'creationDate' in order &&
      'owner' in order &&
      'status' in order &&
      'executedBuyAmount' in order &&
      'executedSellAmount' in order,
  );
}

export async function checkCowSwapActivity(address: string): Promise<CredResult> {
  const normalizedAddress = address.toLowerCase();

  try {
    const response = await fetch(`https://api.cow.fi/base/api/v1/account/${normalizedAddress}/orders`, {
      headers: {
        accept: 'application/json',
      },
    });

    const data: unknown = await response.json();

    // Check for error response
    if (!response.ok) {
      throw new Error(`CowSwap API request failed: ${response.statusText}`);
    }

    if (!isCowSwapResponse(data)) {
      throw new Error('Invalid response format from CowSwap API');
    }

    // Handle empty array case
    if (data.length === 0) {
      return [false, '0'];
    }

    // Filter fulfilled orders
    const fulfilledOrders = data.filter((order) => order.status === 'fulfilled');

    // Calculate total trading volume
    // const totalVolume = fulfilledOrders.reduce((acc, order) => {
    //   return acc + BigInt(order.executedSellAmount);
    // }, BigInt(0));

    // console.log(`CowSwap activity for ${address}: ${fulfilledOrders.length} fulfilled orders`);
    // console.log(`Total trading volume: ${totalVolume.toString()}`);

    // Criteria: At least one fulfilled order
    const hasActivity = fulfilledOrders.length > 0;
    return [hasActivity, fulfilledOrders.length.toString()];
  } catch (error) {
    console.error('Error checking CowSwap activity:', error);
    throw error;
  }
}
