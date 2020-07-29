const BigNumber = require("bignumber.js");

function bnToDecimalString(bn, scaleInput, scaleOutput) {
  // NB: Use of `bigdecimal.js` instead of `BN.js` for currency formatting.
  const decimal = new BigNumber(bn.toString()).dividedBy(10 ** scaleInput);
  return decimal.toFormat(scaleOutput);
}

module.exports = {
  bnToDecimalString,
};
