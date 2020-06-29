const Caller = artifacts.require("Caller");
const Called = artifacts.require("Called");
const CalledLibrary = artifacts.require("CalledLibrary");

module.exports = function (deployer) {
  deployer.deploy(Called);
  deployer.deploy(CalledLibrary);

  deployer.link(CalledLibrary, [Caller]);

  deployer.deploy(Caller);
};
