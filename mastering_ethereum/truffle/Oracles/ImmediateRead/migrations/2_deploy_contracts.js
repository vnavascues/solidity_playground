const {supportedNetworks} = require("../utils/networks");
const {PRICE_FEED_ETH_USD} = require("../utils/price_feeds");
const PriceConsumer = artifacts.require("PriceConsumer");

module.exports = async (deployer, network, accounts) => {
  if (supportedNetworks.includes(network)) {
    await deployer.deploy(PriceConsumer, PRICE_FEED_ETH_USD[network], {
      from: accounts[0],
    });
  } else {
    console.error(`Network not supported: ${network}.`);
  }
};
