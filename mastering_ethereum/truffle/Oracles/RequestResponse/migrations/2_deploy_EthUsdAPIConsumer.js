const {NETWORKS} = require("../utils/networks");
const EthUsdAPIConsumer = artifacts.require("EthUsdAPIConsumer");

module.exports = async (deployer, network, accounts) => {
  const supportedNetworks = [NETWORKS.ROPSTEN, `${NETWORKS.ROPSTEN}-fork`];
  if (supportedNetworks.includes(network)) {
    await deployer.deploy(EthUsdAPIConsumer, {from: accounts[0]});
  } else {
    console.error(`Network not supported: ${network}.`);
  }
};
