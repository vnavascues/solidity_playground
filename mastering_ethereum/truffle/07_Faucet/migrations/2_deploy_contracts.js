const Faucet = artifacts.require("Faucet");
const Token = artifacts.require("Token");

module.exports = async (deployer, _, accounts) => {
  const owner = accounts[0];
  await deployer.deploy(Faucet, {from: owner});
  // NB: Fund Faucet with some Ether or Token deployment will revert because of
  // insufficient funds
  await web3.eth.sendTransaction({
    from: owner,
    to: Faucet.address,
    value: web3.utils.toWei("1", "ether"),
  });
  await deployer.deploy(Token, Faucet.address, {from: owner});
};
