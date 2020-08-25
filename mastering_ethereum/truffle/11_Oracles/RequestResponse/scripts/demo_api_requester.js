/* Request to external APIs how many grams of carbohydrates are in 100g of
 * watermelon.
 * This is a proof of concept for Chainlinked contracts using basic adapters,
 * (non DeFi-like), sending in the transaction the `Chainlink.Request` params
 * and random APIs. Best practices not applied.
 *
 * BEWARE: Any URL query parameter will be readable on the explorer
 * (e.g. API keys).
 *
 * Highlights:
 *   - Tested in Ropsten.
 *   - It requests 2 external APIs via HTTPGet adapter (passing query params).
 *   - Calculates the average off-chain only if the two requests have succeeded.
 *   - Ideally each request should use a different node (subject to Ropsten
 *   nodes availability). Currently only Omniscience-Ropsten seems to respond.
 *   - The requests via HTTPPost & API Aggregator adapters have not succeeded.
 */
require("module-alias/register");
const {bnToDecimalString} = require("@utils/bignumbers.js");

// Set up web3 provider required by truffle contract
const HDWalletProvider = require("@truffle/hdwallet-provider");
const variableExpansion = require("dotenv-expand");
variableExpansion(require("dotenv").config());
const provider = new HDWalletProvider(
  process.env.MNEMONIC_1,
  process.env.ROPSTEN_WSS_ENDPOINT
);
const {
  LinkTokenInterface,
} = require("@chainlink/contracts/truffle/v0.6/LinkTokenInterface");
LinkTokenInterface.setProvider(provider);

// Truffle
const APIRequester = artifacts.require("APIRequester");
const BN = web3.utils.BN;

// Oracle
const tenCentsLINK = "100000000000000000";
// const oneLINK = "1000000000000000000";
const ORACLE_ADDRESS = "0x83da1beeb89ffaf56d0b7c50afb0a66fb4df8cb1";

// Jobs
// Job 1 & 2: Get Multiplied Int Data from Omniscience-Ropsten - Cost 0.1 LINK
//https://market.link/jobs/a0adffe7-7db8-4231-8266-34334cd52fc6
const JOB1_ID = web3.utils.asciiToHex("2f9cdff5cb5f499bb13061dced947426");
const JOB1_COST = tenCentsLINK;
const JOB2_ID = JOB1_ID;
const JOB2_COST = JOB1_COST;
// APIs - Both GET requests
// Spoonacular
const URL1_DOMAIN = "https://api.spoonacular.com";
const URL1_EXT_PATH = "food/ingredients/9326/information";
const URL1_QUERY_PARAMS = `apiKey=${process.env.SPOONACULAR_KEY}&unit=grams&amount=100`;
const URL1 = `${URL1_DOMAIN}/${URL1_EXT_PATH}?${URL1_QUERY_PARAMS}`;
const PATH1 = "nutrition.nutrients.3.amount"; // Path deals with an Array
const TIMES1 = "100";

// USDA
const URL2_DOMAIN = "https://api.nal.usda.gov";
const URL2_EXT_PATH = "fdc/v1/food/786754";
const URL2_QUERY_PARAMS = `api_key=${process.env.USDA_KEY}`;
const URL2 = `${URL2_DOMAIN}/${URL2_EXT_PATH}?${URL2_QUERY_PARAMS}`;
const PATH2 = "foodNutrients.2.amount"; // Path deals with an Array
const TIMES2 = "100";

const LABEL = "carbohydrates"; // Struct property

module.exports = async function (callback) {
  async function getAccounts() {
    return web3.eth.getAccounts();
  }

  async function getPastEvents(
    deployed,
    event,
    filter = {},
    blockNumber = 0,
    toBlock = "latest"
  ) {
    console.log("Reading past events...\n");
    return deployed.getPastEvents(event, {
      filter: filter,
      fromBlock: blockNumber,
      toBlock: toBlock,
    });
  }
  console.log("*** Request grams of carbohydrates in 100g of watermelon ***");

  // Get an account
  const accounts = await getAccounts();
  const owner = accounts[0];

  // Get APIRequester instance
  const apiRequester = await APIRequester.deployed();
  console.log("APIRequester address", apiRequester.address);

  // Get ChainLink contract instance, address and LINK decimals
  const linkTokenAddress = await apiRequester.getChainlinkToken({from: owner});
  console.log("ChainLink Token (LINK) address", linkTokenAddress, "\n");

  const linkToken = await LinkTokenInterface.at(linkTokenAddress);
  const linkDecimals = await linkToken.decimals({from: owner});

  // Oracle and jobs logs
  console.log("Oracle address: ", ORACLE_ADDRESS);
  console.log("Job 1 ID: ", web3.utils.hexToAscii(JOB1_ID));
  console.log(
    `Job 1 Cost: ${bnToDecimalString(
      new BN(JOB1_COST),
      linkDecimals,
      2
    ).toString()} LINK`
  );
  console.log("Job 2 ID: ", web3.utils.hexToAscii(JOB2_ID));
  console.log(
    `Job 2 Cost: ${bnToDecimalString(
      new BN(JOB2_COST),
      linkDecimals,
      2
    ).toString()} LINK\n`
  );

  // NB: Due to requests cost LINK, owner & contract balances are displayed
  // Get owner LINK balance
  const ownerBal = await linkToken.balanceOf(owner, {from: owner});
  console.log(
    `Owner balance: ${bnToDecimalString(
      ownerBal,
      linkDecimals,
      2
    ).toString()} LINK`
  );

  // Get APIRequester LINK balance
  const apiRequesterBal = await linkToken.balanceOf(apiRequester.address, {
    from: owner,
  });
  console.log(
    `APIRequester balance: ${bnToDecimalString(
      apiRequesterBal,
      linkDecimals,
      2
    ).toString()} LINK`
  );

  // Fund contract if it can't pay the two calls
  const totalCost = new BN(JOB1_COST).add(new BN(JOB2_COST));
  if (apiRequesterBal.lt(totalCost)) {
    console.log(
      `Funding APIRequester with ${bnToDecimalString(
        totalCost,
        linkDecimals,
        2
      ).toString()} LINK...\n`
    );
    await linkToken.transfer(apiRequester.address, totalCost.toString(), {
      from: owner,
    });
  }

  // Request 1: Spoonacular API
  console.log("Requesting to Spoonacular API...");
  const request1Receipt = await apiRequester
    .getRequest(
      ORACLE_ADDRESS,
      JOB1_ID,
      JOB1_COST,
      web3.utils.asciiToHex(LABEL),
      URL1,
      PATH1,
      TIMES1,
      {from: owner}
    )
    .catch((e) => {
      console.error(e);
      callback();
    });

  const request1blockNumber = request1Receipt.receipt.blockNumber;
  console.log("Request 1 block number:", request1blockNumber);
  const request1Id = request1Receipt.logs[0].args.id;
  console.log("Request 1 ID:", request1Id, "\n");

  // Request to USDA API
  console.log("Requesting to USDA API...");
  const request2Receipt = await apiRequester
    .getRequest(
      ORACLE_ADDRESS,
      JOB2_ID,
      JOB2_COST,
      // oneLINK,
      web3.utils.asciiToHex(LABEL),
      URL2,
      PATH2,
      TIMES2,
      {from: owner}
    )
    .catch((e) => {
      console.error(e);
      callback();
    });

  const request2blockNumber = request2Receipt.receipt.blockNumber;
  console.log("Request 2 block number:", request2blockNumber);
  const request2Id = request2Receipt.logs[0].args.id;
  console.log("Request 2 ID:", request2Id, "\n");

  // Await certain time until requests are processed
  // NB: The amount of time is non deterministic. A Chainlink node will wait for
  // 3 block confirmations before fulfilling the request.
  console.log("Waiting 2 minutes...\n");
  await new Promise((resolve) => setTimeout(resolve, 120000)); // 2 minutes

  let request1Events = [];
  let request2Events = [];
  let maxMinutes = 2;
  do {
    if (!request1Events.length) {
      request1Events = await getPastEvents(
        apiRequester,
        "RequestFulfilled",
        {requestId: request1Id},
        request1blockNumber,
        "latest"
      );
    }
    if (!request2Events.length) {
      request2Events = await getPastEvents(
        apiRequester,
        "RequestFulfilled",
        {requestId: request2Id},
        request2blockNumber,
        "latest"
      );
    }
    if (!request1Events.length || !request2Events.length) {
      console.log(`Waiting another 30 seconds...\n`);
      await new Promise((resolve) => setTimeout(resolve, 30000));
      maxMinutes = maxMinutes - 0.5;
    }
  } while (
    (!request1Events.length && maxMinutes) ||
    (!request2Events.length && maxMinutes)
  );

  if (!request1Events.length) {
    console.log(
      "Unfortunately the request to the Spoonacular API didn't raise the " +
        "RequestFulfilled event within 4 minutes. " +
        "Please check the transactions on Etherscan and on Chainlink explorer"
    );
    callback();
  }

  if (!request2Events.length) {
    console.log(
      "Unfortunately the request to the USDA API didn't raise the " +
        "RequestFulfilled event within 4 minutes. " +
        "Please check the transactions on Etherscan and on Chainlink explorer"
    );
    callback();
  }

  console.log("--- Grams of carbohydrates per 100g of watermelon ---");

  // Get event values (grams of carbohydrates)
  console.log("Getting values from events...");
  const request1ValueE = request1Events[0].args.value;
  console.log(`Spoonacular: ${bnToDecimalString(request1ValueE, 2, 2)}g`);

  const request2ValueE = request2Events[0].args.value;
  console.log(`USDA: ${bnToDecimalString(request2ValueE, 2, 2)}g`);

  const avgValueE = request1ValueE.add(request2ValueE).div(new BN("2"));
  console.log(`Average: ${bnToDecimalString(avgValueE, 2, 2)}g`);
  console.log("");

  // Get storage values (grams of carbohydrates)
  console.log("Getting values from storage...");
  const request1STG = await apiRequester.requestIDResponseData(request1Id, {
    from: owner,
  });
  const request1ValueSTG = request1STG.value;
  console.log(`Spoonacular: ${bnToDecimalString(request1ValueSTG, 2, 2)}g`);

  const request2STG = await apiRequester.requestIDResponseData(request2Id, {
    from: owner,
  });
  const request2ValueSTG = request2STG.value;
  console.log(`USDA: ${bnToDecimalString(request2ValueSTG, 2, 2)}g`);

  const avgValueSTG = request1ValueSTG.add(request2ValueSTG).div(new BN("2"));
  console.log(`Average: ${bnToDecimalString(avgValueSTG, 2, 2)}g`);
  callback();
};
