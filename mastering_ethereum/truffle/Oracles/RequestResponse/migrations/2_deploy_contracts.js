const {NETWORKS} = require("../utils/networks");
const PriceAPIConsumer = artifacts.require("PriceAPIConsumer");

module.exports = async (deployer, network, accounts) => {
  const supportedNetworks = [NETWORKS.ROPSTEN, `${NETWORKS.ROPSTEN}-fork`];
  if (supportedNetworks.includes(network)) {
    await deployer.deploy(PriceAPIConsumer, {from: accounts[0]});
  } else {
    console.error(`Network not supported: ${network}.`);
  }
};
