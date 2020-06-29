const Faucet5 = artifacts.require("./Faucet5.sol");

Faucet5.web3.eth.getGasPrice(async function (error, result) {
  const gasPrice = Number(result);

  console.log(`Gas Price is ${gasPrice} wei`); // "10000000000000"

  // Get the contract instance
  const instance = await Faucet5.deployed();

  await instance.send(web3.utils.toWei("1", "ether"));

  const gas_ = await instance.withdraw.estimateGas(
    web3.utils.toWei("0.1", "ether")
  );

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
