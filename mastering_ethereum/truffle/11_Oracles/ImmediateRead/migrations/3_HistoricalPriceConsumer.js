const {supportedNetworks} = require("../utils/networks");
const {PRICE_FEED_ETH_USD} = require("../utils/price_feeds");
const HistoricalPriceConsumer = artifacts.require("HistoricalPriceConsumer");

module.exports = async (deployer, network, accounts) => {
  if (supportedNetworks.includes(network)) {
    await deployer.deploy(
      HistoricalPriceConsumer,
      PRICE_FEED_ETH_USD[network],
      {
        from: accounts[0],
      }
    );
  } else {
    console.error(`Network not supported: ${network}.`);
  }
};
