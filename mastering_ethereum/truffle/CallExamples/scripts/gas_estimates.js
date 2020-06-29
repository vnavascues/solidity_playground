const Caller = artifacts.require("./Caller.sol");

Caller.web3.eth.getGasPrice(async function (error, result) {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  const gasPrice = Number(result);

  console.log(`Gas Price is ${gasPrice} wei`); // "10000000000000"

  // Get the contract instance
  const instance = await Caller.deployed();

  const gas_ = await instance.makeCalls.estimateGas(account);

  const gas = Number(gas_);
  const gasCostEstimation = gas * gasPrice;

  console.log(`Gas estimation = ${gas} units`);
  console.log(`Gas cost estimation = ${gasCostEstimation} wei`);
  console.log(
    `Gas cost estimation = ${web3.utils.fromWei(
      String(gasCostEstimation),
      "ether"
    )} ether`
  );
});
