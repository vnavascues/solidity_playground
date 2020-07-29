/* When it comes to instantiate an already existing contract in a public network
 * (e.g. Ropsten), the contract ABI and its address are mandatory. When using
 * Truffle (along with web3) and the contract has not been deployed by us, a
 * different set of approaches can be followed (not all listed):
 *
 *   - Instantiate the contract via `web3.eth.Contract()`.
 *     - https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html
 *   - Instantiate the contract via `@truffle/contract`.
 *     - https://github.com/trufflesuite/truffle/tree/master/packages/contract
 *
 * Some differences are:
 *   - Contract methods that return a number (e.g. uint356) return a String via
 * `web3.eth.Contract()` but BN via `@truffle/contract`.
 *   - Different contract method calls syntax.
 *
 * Which one follow will depend on how you provide the contract ABI. Some
 * examples below:
 *   - A local custom JSON file with either the official or a custom ABI.
 *   - A local custom JS object with either the official or a custom ABI.
 *   - The JSON ABI from the Truffle builds.
 *   - A JS module from the official SDK as a Node module.
 *
 *
 * Just for learning purposes below some of the approaches followed before using
 * `@truffle/contract` along the official `LinkTokenInterface.js` provided by
 * Chainlink in `@chainlink/contracts`:
 *   - Due to LINK token is an ERC677 and only `balanceOf()` and `decimals()`
 *   are called, a custom minimal ERC20 ABI can be created.
 *
 * OPTION 1: A local JS object using Web3
 *   Create a .js file a an Array with the minERC20abi:
 *
 * File `minERC20.js`:
 *
 *   const minERC20 = [
 *     {
 *       "constant": true,
 *       "inputs": [{"name": "_owner", "type": "address"}],
 *       "name": "balanceOf",
 *       "outputs": [{"name": "balance", "type": "uint256"}],
 *       "type": "function"
 *     }
 *   ]
 *   exports.minERC20 = minERC20;
 *
 * File `demo.js`:
 *
 *   const {minERC20.js} = require("./abis/minERC20");
 *   ...
 *   const linkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
 *   const linkToken = new web3.eth.Contract(linkTokenABI, linkTokenAddress);
 *
 *
 * OPTION 2: A local JSON ABI using Web3
 *   Create a JSON file a an Array with the minERC20 abi. Alternatively use the
 * official LinkTokenInterface ABI:
 *   - https://github.com/smartcontractkit/LinkToken
 *
 * File `minERC20.json`:
 *
 *   [
 *     {
 *       "constant": true,
 *       "inputs": [{"name": "_owner", "type": "address"}],
 *       "name": "balanceOf",
 *       "outputs": [{"name": "balance", "type": "uint256"}],
 *       "type": "function"
 *     }
 *   ]
 *
 * File `demo.js`:
 *
 *   const fs = require("fs");
 *   const minERC20ABI = JSON.parse(fs.readFileSync("./abis/minERC20.json"));
 *   ...
 *   const linkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
 *   const linkToken = new web3.eth.Contract(linkTokenABI, linkTokenAddress);
 *
 *
 * OPTION 3: Use the
 *   Use the official JSON ABI from Truffle builds:
 *
 * File `demo.js`:
 *
 *   const fs = require("fs");
 *   const LinkTokenInterface = JSON.parse(
 *     fs.readFileSync("./../builds/contracts/LinkTokenInterface.json"));
 *   ...
 *   const linkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
 *   const linkToken = new web3.eth.Contract(LinkTokenInterface.abi, linkTokenAddress);
 *
 *
 * Ropsten ChainLink Token (LINK) address:
 *  - 0x20fE562d797A42Dcb3399062AE9546cd06f63280
 *
 * Ropsten Chainlink Explorer:
 *  - https://ropsten.explorer.chain.link/
 *
 * Ropsten LINK faucet:
 *  - https://ropsten.chain.link/
 *
 * Ropsten PriceAPIConsumer contract addresses:
 *  - 0x66e1d52805695DDaf8D7835F45cE196D7827b559
 *
 * Node details (from Chainlink Market):
 *  - https://market.link/jobs/d1178a2c-d090-4396-9b09-5f278cfaa155
 *
 * Oracle Ropsten contract address:
 *  - 0x83F00b902cbf06E316C95F51cbEeD9D2572a349a
 *
 * Node Job Id:
 *  - d00773d991984ceda7902304b324c718
 *
 * Contract address
 *  - 0x66e1d52805695ddaf8d7835f45ce196d7827b559
 *
 * List of some request Id generated (readable via getPastEvents()):
 *  - 0x28d60e3f981c8d7a7dd1966a55a7323747058ad8db15b6d7802862de6307e5ab
 *  - 0xf4bc928473e63e7b40ce3997cc0ffc30164c942b97bc826eb1b67189167b9599
 *  - 0x0807bc59488185e4c6babd4cb3ce403e0f121673a89ea1ec27802001c09df2de
 *  - 0x4c1bac4093f4903e017641539bb147772e20cc560448881a0d7bcc29b8309655
 *  - 0x441a7cd46928bb3da7ae4f57ec484b5e96645019ae4fee254dc9ab5a9a19dc99
 *  - 0x2761662d57c76692771a39adff2dd4c89a848068bed228b658452fa6d1d54a48
 */
require("module-alias/register");
const {bnToDecimalString} = require("@utils/bignumbers.js");

// Set up web3 provider required by truffle contract
const HDWalletProvider = require("@truffle/hdwallet-provider");
const variableExpansion = require("dotenv-expand");
variableExpansion(require("dotenv").config());
const provider = new HDWalletProvider(
  process.env.MNEMONIC_2,
  process.env.ROPSTEN_WSS_ENDPOINT
);
const {
  LinkTokenInterface,
} = require("@chainlink/contracts/truffle/v0.6/LinkTokenInterface");
LinkTokenInterface.setProvider(provider);

// Truffle
const PriceAPIConsumer = artifacts.require("PriceAPIConsumer");
const BN = web3.utils.BN;

// Oracle
const ORACLE_ADDRESS = "0x83da1beeb89ffaf56d0b7c50afb0a66fb4df8cb1";
const JOB_ID = web3.utils.asciiToHex("d00773d991984ceda7902304b324c718");
const oneLINK = "1000000000000000000";

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

  // Initial logs
  console.log("Oracle contract address", ORACLE_ADDRESS);
  console.log("Job ID", web3.utils.hexToAscii(JOB_ID));

  // Get an account
  const accounts = await getAccounts();
  const owner = accounts[0];

  // Get PriceAPIConsumer instance and events
  const priceAPIConsumer = await PriceAPIConsumer.deployed().catch((e) =>
    console.log(e)
  );
  console.log("PriceAPIConsumer contract address", priceAPIConsumer.address);

  // Get ChainLink contract instance and address
  const linkTokenAddress = await priceAPIConsumer.getChainlinkToken({
    from: owner,
  });
  console.log("ChainLink Token (LINK) address", linkTokenAddress);
  console.log("");

  const linkToken = await LinkTokenInterface.at(linkTokenAddress);

  const linkDecimals = await linkToken.decimals({from: owner});

  const denominator = new BN(10).pow(linkDecimals);

  // Get Owner account LINK balance
  // NB: Due to testnet requests cost 1 LINK, owner balance is displayed
  const ownerBalance = await linkToken.balanceOf(owner, {from: owner});

  console.log(
    `LINK owner balance: ${ownerBalance.div(denominator).toString()}`
  );

  // Get PriceAPIConsumer LINK balance
  const priceAPIConsumerBalance = await linkToken.balanceOf(
    priceAPIConsumer.address,
    {from: owner}
  );

  console.log(
    `LINK contract balance: ${priceAPIConsumerBalance
      .div(denominator)
      .toString()}`
  );
  console.log("");

  // Fund PriceAPIConsumer contract with LINK if its balance is 0
  if (priceAPIConsumerBalance.isZero()) {
    console.log("Funding PriceAPIConsumer with 1 LINK...\n");
    await linkToken.transfer(priceAPIConsumer.address, oneLINK, {
      from: owner,
    });
  }

  // Request price
  console.log("Requesting price...");
  const receipt = await priceAPIConsumer.requestPrice(ORACLE_ADDRESS, JOB_ID, {
    from: owner,
  });
  console.log("Transaction receipt", receipt);
  console.log("");

  // Get blockNumber from tx, and requestID from `ChainlinkRequested` event
  const blockNumber = receipt.receipt.blockNumber;
  console.log("Block Number:", blockNumber);
  const requestId = receipt.logs[0].args.id;
  console.log("requestID:", requestId);
  console.log("");

  // Await certain time until request is processed
  // NB: The amount of time is non deterministic. A Chainlink node will wait for
  // 3 block confirmations before fulfilling the request.
  console.log("Waiting 2 minutes...\n");
  await new Promise((resolve) => setTimeout(resolve, 120000)); // 2 minutes

  let pastEvents = [];
  let maxMinutes = 2;
  do {
    pastEvents = await getPastEvents(
      priceAPIConsumer,
      "ChainlinkFulfilled",
      {id: requestId},
      blockNumber,
      "latest"
    );
    if (!pastEvents.length) {
      console.log(`Waiting another 30 seconds...\n`);
      await new Promise((resolve) => setTimeout(resolve, 30000));
      maxMinutes = maxMinutes - 0.5;
    }
  } while (!pastEvents.length && maxMinutes);

  if (!pastEvents.length) {
    console.log(
      "Unfortunately no ChainlinkFulfilled event has been risen within 4 minutes! " +
        "Please check the transactions on Etherscan and on Chainlink explorer"
    );
    callback();
  }
  const eventChainlinkFulfilled = pastEvents[0];
  console.log("Event ChainlinkFulfilled", eventChainlinkFulfilled);
  console.log("");

  // NB: This event is risen at the same time than `ChainlinkFulfilled`.
  const eventRequestPriceFulfilled = await getPastEvents(
    priceAPIConsumer,
    "RequestPriceFulfilled",
    {requestId: requestId},
    blockNumber,
    "latest"
  );

  console.log("Event RequestPriceFulfilled", eventRequestPriceFulfilled[0]);
  console.log("");

  const currentPrice = eventRequestPriceFulfilled[0].args.price;
  console.log(`Current price ETH: $${bnToDecimalString(currentPrice, 8, 2)}`);

  callback();
};
