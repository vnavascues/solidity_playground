const PriceConsumer = artifacts.require("PriceConsumer");

// Ropsten PriceConsumer contract address
// 0x8fDff122b446660B85F757e7aDc0D63feb41dcA8
module.exports = async function (callback) {
  async function getAccounts() {
    return web3.eth.getAccounts();
  }

  // Get an account
  const accounts = await getAccounts();
  const owner = accounts[0];

  // Get instance
  const priceConsumer = await PriceConsumer.deployed().catch((e) =>
    console.log(e)
  );

  // Get latest price
  const latestPrice = await priceConsumer.getLatestPrice({from: owner});

  console.log("Latest Price: ", latestPrice.toNumber() / 1e8);

  // Get latest price timestamp
  const latestPriceTimestamp = await priceConsumer.getLatestPriceTimestamp({
    from: owner,
  });

  console.log("Latest Price Timestamp: ", latestPriceTimestamp);

  callback();
};
