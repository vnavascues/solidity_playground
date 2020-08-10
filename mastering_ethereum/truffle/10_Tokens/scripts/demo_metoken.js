const METoken = artifacts.require("METoken");
const METFaucet = artifacts.require("METFaucet");

module.exports = async function (callback) {
  let owner, account1;
  let metToken;
  let metFaucet;

  async function getAccounts() {
    return web3.eth.getAccounts();
  }

  async function getBalance(address) {
    return web3.eth.getBalance(address);
  }

  function toEther(wei) {
    return web3.utils.fromWei(wei, "ether");
  }

  async function logAllowances() {
    // Get METFaucet allowances
    let ownerOwnerAll = await metToken
      .allowance(owner, owner)
      .catch((e) => console.log(e));
    let ownerMEFaucetAll = await metToken
      .allowance(owner, metFaucet.address)
      .catch((e) => console.log(e));

    console.log("METoken owner - owner allowance:", ownerOwnerAll.toString());
    console.log(
      "METoken owner - MEFaucet allowance:",
      ownerMEFaucetAll.toString()
    );
    console.log("");
  }
  async function logBalances() {
    // Get accounts and contract balances
    let metTokenEtherBal = await getBalance(metToken.address);
    let metFaucetEtherBal = await getBalance(metFaucet.address);
    let ownerEtherBal = await getBalance(owner);
    let account1EtherBal = await getBalance(account1);

    console.log("METoken ether balance:", toEther(metTokenEtherBal.toString()));
    console.log(
      "METFaucet ether balance:",
      toEther(metFaucetEtherBal.toString())
    );
    console.log("Owner ether balance:", toEther(ownerEtherBal.toString()));
    console.log(
      "Account1 ether balance:",
      toEther(account1EtherBal.toString())
    );
    console.log("");

    // Get METoken balances
    let metFaucetMETBal = await metToken
      .balanceOf(metFaucet.address)
      .catch((e) => console.log(e));
    let ownerMETBal = await metToken
      .balanceOf(owner)
      .catch((e) => console.log(e));
    let account1METBal = await metToken
      .balanceOf(account1)
      .catch((e) => console.log(e));

    console.log("METoken METFaucet MET balance:", metFaucetMETBal.toString());
    console.log("METoken owner MET balance:", ownerMETBal.toString());
    console.log("METoken account1 MET balance:", account1METBal.toString());
    console.log("");
  }

  // Get an account
  const accounts = await getAccounts();
  [owner, account1] = accounts;

  // Deploy contracts
  console.log("1. Deploy");

  metToken = await METoken.deployed().catch((e) => console.log(e));
  metFaucet = await METFaucet.deployed().catch((e) => console.log(e));

  await logBalances();

  // Set allowances
  console.log("2. Set up balances and allowances");

  // Transfer 1000 MET to the METFaucet address (update its balances in METoken)
  // for `withdrawViaTransfer()`
  await metToken
    .transfer(metFaucet.address, 1000, {from: owner})
    .catch((e) => console.log(e));

  // Set allowance for `withdrawViaTransferFrom()` (using `METoken.transferFrom()`)
  await metToken
    .approve(metFaucet.address, 1000, {from: owner})
    .catch((e) => console.log(e));

  await logBalances();

  // Withdraw 1000 MET from METFaucet balances to Account1 balances
  // (both are METoken balances)
  console.log("3. Withdraw with withdrawViaTransfer()");

  await metFaucet
    .withdrawViaTransfer(1000, {from: account1})
    .catch((e) => console.log(e));

  await logBalances();
  await logAllowances();

  // Withdraw 1000 MET from owner balances to Account1 balances
  // (both are METoken balances)
  console.log("4. Withdraw with withdrawViaTransferFrom()");

  await metFaucet
    .withdrawViaTransferFrom(1000, {from: account1})
    .catch((e) => console.log(e));

  await logBalances();
  await logAllowances();

  callback();
};
