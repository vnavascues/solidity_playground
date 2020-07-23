const PriceConsumer = artifacts.require("PriceConsumer");
const NETWORKS = {
  DEV: "dev",
  DEVELOPMENT: "development",
  // Infura
  GOERLI: "goerli",
  KOVAN: "kovan",
  MAINNET: "mainnet",
  RINKEBY: "rinkeby",
  ROPSTEN: "ropsten",
  // Local Geth
  LOCAL_ROPSTEN: "local_ropsten",
};
// Chainlink price feed contracts
const PRICE_FEED_ETH_USD = {
  [NETWORKS.KOVAN]: "0xD21912D8762078598283B14cbA40Cb4bFCb87581",
  [NETWORKS.MAINNET]: "0xF79D6aFBb6dA890132F9D7c355e3015f15F3406F",
  [NETWORKS.RINKEBY]: "0x0bF4e7bf3e1f6D6Dc29AA516A33134985cC3A5aA",
  [NETWORKS.ROPSTEN]: "0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507",
  [NETWORKS.LOCAL_ROPSTEN]: "0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507",
};
// NB: Only support public test networks, and their forked version
// (via Truffle dry run mode)
const supportedPublicNetworks = [
  NETWORKS.KOVAN,
  NETWORKS.RINKEBY,
  NETWORKS.ROPSTEN,
  NETWORKS.LOCAL_ROPSTEN,
];
const supportedNetworks = supportedPublicNetworks.concat(
  supportedPublicNetworks.map((n) => `${n}-fork`)
);

module.exports = async (deployer, network, accounts) => {
  if (supportedNetworks.includes(network)) {
    await deployer.deploy(PriceConsumer, PRICE_FEED_ETH_USD[network], {
      from: accounts[0],
    });
  } else {
    console.error(`Network not supported: ${network}.`);
  }
};
