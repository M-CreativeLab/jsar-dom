export const serializeNumber = (value: number): string => {
  const parts = value.toFixed(3).split('.');
  const decimal = parts[1].replace(/0+$/, '');
  if (decimal) {
    const integer = parts[0].replace(/^0/, '');
    return `${integer}.${decimal}`;
  }
  return parts[0];
};
