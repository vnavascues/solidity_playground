/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */
const HDWalletProvider = require("@truffle/hdwallet-provider");
const variableExpansion = require("dotenv-expand");
variableExpansion(require("dotenv").config());

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
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
      gasPrice: 10000000000,
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

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.10",
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
};
