const Owned = artifacts.require("Owned");
const EtherStoreFixed = artifacts.require("EtherStoreFixed");
const AttackFixed = artifacts.require("AttackFixed");

module.exports = async (deployer) => {
  await deployer.deploy(Owned);
  await deployer.deploy(EtherStoreFixed);
  await deployer.deploy(AttackFixed, EtherStoreFixed.address);
};
