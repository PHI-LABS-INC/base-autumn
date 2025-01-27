import { Address } from 'viem';
import { GeneralTxItem } from '../../../utils/types';

export const txFilter_Standard = (
  tx: GeneralTxItem,
  checkAddresses: (Address | 'any')[],
  methodIds: (string | 'any')[],
): boolean => {
  // Ensure tx and tx.to are defined
  if (!tx || typeof tx.to !== 'string') {
    return false;
  }

  const isCorrectContract =
    checkAddresses.includes('any') ||
    checkAddresses.some((addr) => typeof addr === 'string' && tx.to.toLowerCase() === addr.toLowerCase());

  const isCorrectMethod =
    methodIds.includes('any') || (typeof tx.methodId === 'string' && methodIds.includes(tx.methodId));

  return isCorrectContract && isCorrectMethod;
};

export const txFilter_Contract = (tx: GeneralTxItem, checkAddresses: string | string[]): boolean => {
  const addresses = Array.isArray(checkAddresses) ? checkAddresses : [checkAddresses];
  return addresses.some((address) => tx.to.toLowerCase() === address.toLowerCase());
};

export const txFilter_From = (tx: GeneralTxItem, checkAddresses: string[]): boolean => {
  const addresses = Array.isArray(checkAddresses) ? checkAddresses : [checkAddresses];
  return addresses.some((address) => tx.from.toLowerCase() === address.toLowerCase());
};

export const txFilter_Any = (tx: GeneralTxItem): boolean => {
  return true;
};

const CHRISTMAS_2024_START = Math.floor(new Date('2024-12-24T00:00:00Z').getTime() / 1000);
const CHRISTMAS_2024_END = Math.floor(new Date('2024-12-25T23:59:59Z').getTime() / 1000);

export const txFilter_Christmas = (tx: GeneralTxItem) => {
  if (!tx.timeStamp) {
    return false;
  }
  const txTimestamp = parseInt(tx.timeStamp);
  return txTimestamp >= CHRISTMAS_2024_START && txTimestamp <= CHRISTMAS_2024_END;
};
