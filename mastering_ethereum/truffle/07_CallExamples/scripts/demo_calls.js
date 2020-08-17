const CalledLibrary = artifacts.require("CalledLibrary");
const Called = artifacts.require("Called");
const Caller = artifacts.require("Caller");

module.exports = async function (callback) {
  async function getAccounts() {
    return web3.eth.getAccounts();
  }
  const accounts = await getAccounts();
  const account = accounts[0];

  console.log(`Account address: ${account}`);
  console.log(`CalledLibrary contract address: ${CalledLibrary.address}`);
  console.log(`Called contract address: ${Called.address}`);
  console.log(`Caller contract address: ${Caller.address}`);

  const instance = await Caller.deployed();

  const recipe = await instance.makeCalls(Called.address);

  console.log("Events from 'makeCalls()'...");

  recipe.logs.forEach((log) => console.log(log.args));

  callback();
};
