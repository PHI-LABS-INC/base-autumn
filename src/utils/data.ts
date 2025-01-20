export const Season0endDate = (() => {
  const date = new Date(2024, 10, 16, 23, 59, 59); // month start from 0.
  return Math.floor(date.getTime() / 1000);
})();

export const Season1endDate = (() => {
  const date = new Date(2025, 1, 20, 23, 59, 59); // month start from 0, so 1 = February
  return Math.floor(date.getTime() / 1000);
})();
