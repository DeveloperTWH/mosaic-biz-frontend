export const formatMoneyInterval = (
  price: number,
  currency: string,
  interval: 'day' | 'week' | 'month' | 'year',
  intervalCount: number
) => {
  const money = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency || 'USD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2,
  }).format(price);

  const every = intervalCount > 1 ? `every ${intervalCount} ${interval}s` : `per ${interval}`;
  return `${money} ${every}`;
};

export const createdOn = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
