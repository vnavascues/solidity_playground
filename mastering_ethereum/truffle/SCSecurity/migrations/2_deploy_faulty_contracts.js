const EtherStoreFaulty = artifacts.require("EtherStoreFaulty");
const AttackFaulty = artifacts.require("AttackFaulty");

module.exports = async (deployer) => {
  await deployer.deploy(EtherStoreFaulty);
  await deployer.deploy(AttackFaulty, EtherStoreFaulty.address);
};
