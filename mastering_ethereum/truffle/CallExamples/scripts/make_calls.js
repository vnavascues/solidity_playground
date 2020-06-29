const CalledLibrary = artifacts.require("./CalledLibrary.sol");
const Called = artifacts.require("./Called.sol");
const Caller = artifacts.require("./Caller.sol");

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

  const res = await instance.makeCalls(Called.address);

  console.log("Call to 'makeCalls' logs...");

  res.logs.forEach((log) => console.log(log.args));

  callback();
};
