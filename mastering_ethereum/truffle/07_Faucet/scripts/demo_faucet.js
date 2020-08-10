const Faucet = artifacts.require("Faucet");
const Token = artifacts.require("Token");

module.exports = async function (callback) {
  async function getAccounts() {
    return web3.eth.getAccounts();
  }

  function toEther(wei) {
    return web3.utils.fromWei(wei, "ether");
  }

  // Get an account
  const accounts = await getAccounts();
  const owner = accounts[0];

  // Contract instances
  const faucet = await Faucet.deployed();
  const token = await Token.deployed();

  // Get balances
  let tokenBal = await web3.eth.getBalance(token.address);
  console.log("Token ether balance:", toEther(tokenBal.toString()));

  let faucetBal = await web3.eth.getBalance(faucet.address);
  console.log("Faucet ether balance:", toEther(faucetBal.toString()));

  let ownerBal = await web3.eth.getBalance(owner);
  console.log("Owner ether balance:", toEther(ownerBal.toString()));
  console.log("");

  // Funding Faucet and logging the transaction event
  console.log("Sending 1 ether to Faucet...");
  const recipe2 = await faucet.send(web3.utils.toWei("1", "ether"), {
    from: owner,
  });

  console.log("Response logs:");
  console.log(`Event: ${recipe2.logs[0].event}`);
  console.log(`From: ${recipe2.logs[0].args[0]}`);
  console.log(
    `Amount: ${web3.utils.fromWei(recipe2.logs[0].args[1], "ether")} ether`
  );
  console.log("");

  // Get balances after funding Faucet
  faucetBal = await web3.eth.getBalance(faucet.address);
  console.log("Faucet ether balance:", toEther(faucetBal.toString()));

  ownerBal = await web3.eth.getBalance(owner);
  console.log("Owner ether balance:", toEther(ownerBal.toString()));
  console.log("");

  // Withdrawing from Faucet and logging the transaction event
  console.log("Withdrawing 0.1 ether from Faucet...");

  const recipe3 = await faucet.withdraw(web3.utils.toWei("0.1", "ether"), {
    from: owner,
  });

  console.log("Response logs:");
  console.log(`Event: ${recipe3.logs[0].event}`);
  console.log(`To: ${recipe3.logs[0].args[0]}`);
  console.log(
    `Amount: ${web3.utils.fromWei(recipe3.logs[0].args[1], "ether")} ether`
  );
  console.log("");

  // Get balances after withdrawing from Faucet
  faucetBal = await web3.eth.getBalance(faucet.address);
  console.log("Faucet ether balance:", toEther(faucetBal.toString()));

  ownerBal = await web3.eth.getBalance(owner);
  console.log("Owner ether balance:", toEther(ownerBal.toString()));

  callback();
};
