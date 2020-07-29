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

module.exports = {
  NETWORKS,
  supportedPublicNetworks,
  supportedNetworks,
};
