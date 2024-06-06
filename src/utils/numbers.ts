export const toFixedIfNecessary = (value: number, fractionDigit: number) => {
  return +value.toFixed(fractionDigit);
};
