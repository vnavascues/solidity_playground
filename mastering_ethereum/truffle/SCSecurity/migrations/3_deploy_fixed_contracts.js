const EtherStoreFixed = artifacts.require("EtherStoreFixed");
const AttackFixed = artifacts.require("AttackFixed");

module.exports = async (deployer, _, accounts) => {
  const attackerAddr = accounts[0];
  const etherStoreFixedOwnerAddr = accounts[1];

  await deployer.deploy(EtherStoreFixed, { from: etherStoreFixedOwnerAddr });
  await deployer.deploy(AttackFixed, EtherStoreFixed.address, {
    from: attackerAddr,
  });
};
