const METoken = artifacts.require("METoken");
const METFaucet = artifacts.require("METFaucet");

module.exports = async (deployer, _, accounts) => {
  const owner = accounts[0];
  await deployer.deploy(METoken, {from: owner});
  await deployer.deploy(METFaucet, METoken.address, owner);
};
