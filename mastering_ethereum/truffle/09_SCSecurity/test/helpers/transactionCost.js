const assert = require("power-assert");
const { BN } = require("@openzeppelin/test-helpers/src/setup");

function transactionCost(gasPrice, gasUsed) {
  const validTypes = ["string", "number"];
  assert(validTypes.includes(typeof gasPrice));
  assert(validTypes.includes(typeof gasUsed));
  const gasPrice_ = new BN(gasPrice);
  const gasUsed_ = new BN(gasUsed);
  return gasPrice_.mul(gasUsed_);
}

module.exports = {
  transactionCost: transactionCost,
};
