const Faucet5 = artifacts.require("Faucet5");

module.exports = async function (callback) {
  const instance = await Faucet5.deployed();

  console.log("Sending 1 ether...");

  let res1 = await instance.send(web3.utils.toWei("1", "ether"));

  console.log("Response logs:");
  console.log(`Event: ${res1.logs[0].event}`);
  console.log(`From: ${res1.logs[0].args[0]}`);
  console.log(
    `Amount: ${web3.utils.fromWei(res1.logs[0].args[1], "ether")} ether`
  );

  console.log("\n");
  console.log("Withdrawing 0.1 ether...");

  let res2 = await instance.withdraw(web3.utils.toWei("0.1", "ether"));

  console.log("Response logs:");
  console.log(`Event: ${res2.logs[0].event}`);
  console.log(`To: ${res2.logs[0].args[0]}`);
  console.log(
    `Amount: ${web3.utils.fromWei(res2.logs[0].args[1], "ether")} ether`
  );

  callback();
};
