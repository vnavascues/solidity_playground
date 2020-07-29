const PriceConsumer = artifacts.require("PriceConsumer");
const HistoricalPriceConsumer = artifacts.require("HistoricalPriceConsumer");

// Ropsten contract addresses
// PriceConsumer
// 0x3f9747eCBF5Db2d039e7861fC2aFC2E67dDd7ecF
// HistoricalPriceConsumer
// 0x83767e8dd507F1903f24af85Dd245216AF0B0846
// ETH-USD price feed
// https://feeds.chain.link/eth-usd
module.exports = async function (callback) {
  async function getAccounts() {
    return web3.eth.getAccounts();
  }

  // Get an account
  const accounts = await getAccounts();
  const owner = accounts[0];

  // Get instances
  const priceConsumer = await PriceConsumer.deployed().catch((e) =>
    console.log(e)
  );
  const historicalPriceConsumer = await HistoricalPriceConsumer.deployed().catch(
    (e) => console.log(e)
  );

  // PriceConsumer requests
  // Get latest price
  const latestPrice = await priceConsumer.getLatestPrice({from: owner});
  console.log("--- PriceConsumer ---");
  console.log(`Latest Price (all precision): ${latestPrice.toNumber()}`);
  console.log(`Latest Price USD: $${latestPrice.toNumber() / 1e8}`);

  // Get latest price timestamp
  const latestPriceTimestamp = await priceConsumer.getLatestPriceTimestamp({
    from: owner,
  });
  console.log(`Latest Price Timestamp: ${latestPriceTimestamp.toString()}`);
  console.log("");

  // HistoricalPriceConsumer requests
  // NB: For an unknown reason, only the latest round returns the current price
  // feed and any round behind returns almost the same price. Despite of this,
  // the following code requests a week ago price.
  // Get current round
  const heartbeat = 10800; // seconds
  const roundBack = Math.round((60 * 60 * 24 * 7) / heartbeat); // a week ago in rounds
  const latestRound = await historicalPriceConsumer.getLatestRound({
    from: owner,
  });
  console.log("--- HistoricalPriceConsumer ---");
  console.log("*Warning: any previous round returns almost the same price");
  console.log(`Latest Round: ${latestRound}`);

  // Define a previous round
  const roundDelta = latestRound - roundBack;
  console.log(`Rounds Back (a week in rounds): ${roundBack}`);
  console.log(`Previous Round (approx a week ago): ${roundDelta}`);

  // Get previous price
  const previousPrice = await historicalPriceConsumer.getPreviousPrice(
    roundDelta,
    {
      from: owner,
    }
  );
  console.log(`Previous Price (all precision): ${previousPrice.toNumber()}`);
  console.log(`Previous Price USD: $${previousPrice.toNumber() / 1e8}`);

  // Get previous price timestamp
  const previousPriceTimestamp = await historicalPriceConsumer.getPreviousPriceTimestamp(
    roundDelta,
    {
      from: owner,
    }
  );
  console.log(`Previous Price Timestamp: ${previousPriceTimestamp.toString()}`);

  callback();
};
