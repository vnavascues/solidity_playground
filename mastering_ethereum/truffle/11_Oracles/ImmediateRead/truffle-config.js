const HDWalletProvider = require("@truffle/hdwallet-provider");
const variableExpansion = require("dotenv-expand");
variableExpansion(require("dotenv").config());

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    local_ropsten: {
      provider: () =>
        new HDWalletProvider(process.env.MNEMONIC_2, "http://localhost:8545"),
      network_id: 3,
      skipDryRun: true,
    },
    kovan: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC_2,
          process.env.KOVAN_HTTPS_ENDPOINT
        ),
      network_id: 42,
      skipDryRun: true,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC_2,
          process.env.RINKEBY_HTTPS_ENDPOINT
        ),
      network_id: 4,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC_2,
          process.env.ROPSTEN_WSS_ENDPOINT
        ),
      network_id: 3,
      gas: 5500000,
      gasPrice: 100000000000,
      timeoutBlocks: 4000,
      skipDryRun: true,
      websockets: true,
    },
    dev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    },
  },
  compilers: {
    solc: {
      version: "0.6.10",
    },
  },
};
