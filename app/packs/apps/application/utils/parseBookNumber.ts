import BigNumber from 'bignumber.js';

export const BigNumberConfig = {
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
  },
};

BigNumber.config(BigNumberConfig);
export const parseBookNumber = (str: string) => {
  const number = new BigNumber(str);
  if (number.isLessThan(1)) {
    return number.toFixed(8).replace(/0+$/i, '0');
  } else if (number.isLessThan(100)) {
    return number.toFixed(6).replace(/0+$/i, '0');
  } else if (number.isLessThan(10000)) {
    return number.toFixed(4).replace(/0+$/i, '0');
  } else if (number.isLessThan(1000000)) {
    return number.toFixed(2).replace(/0+$/i, '0');
  } else {
    return number.toFixed(0).replace(/0+$/i, '0');
  }
};
