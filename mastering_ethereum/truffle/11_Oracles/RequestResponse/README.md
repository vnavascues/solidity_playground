# Mastering Ethereum - Truffle - 11_Oracles - RequestResponse

## Introduction

[Chainlink Developers Documentation](https://docs.chain.link/docs)

[Chainlink GitHub](https://github.com/smartcontractkit/chainlink)

[Chainlink Contracts](https://www.npmjs.com/package/@chainlink/contracts)

[Chainlink Market - Ropsten](https://market.link/search/jobs?search=ropsten)

This project implements in **Truffle** (instead of in **Remix IDE**) the following **Chainlink Developer Documentation - Using Any API Feeds** tutorials:

- [Make a GET Request](https://docs.chain.link/docs/make-a-http-get-request)

- [Make an Existing Job Request](https://docs.chain.link/docs/existing-job-request)

- [Create a Chainlinked Project](https://docs.chain.link/docs/create-a-chainlinked-project) (already in **Truffle** via a **Truffle Box**)

For requesting any API a contract must be a **Chainlinked** contract and requires:

- Inherit from the `ChainlinkClient.sol` **Chainlink contracts** contract.

- The **LINK (token) contract address**.

- The **oracle contract address**.

- The **job ID**.

- The job **adapter** (e.g. `HTTPGet`, `HTTPPost`, etc.) and its associated **tasks**.

- Funding the contract with **LINK** (for paying the node operator).

This project uses **Ropsten** oracles. Check **Chainlink Market - Ropsten** for finding oracles and jobs in this network.

## Contents

### Contracts

**BEWARE**: the contracts have been implemented using Solidity v0.6.12.

- [APIRequester.sol](contracts/APIRequester.sol): a contract that requests numeric datum to any API using the most basic built-in adapters: `HttpGet` and `HttpPost`. This contract is just a proof of concept and does not follow the best practices: it is oracle/job/API agnostic (but focused on requesting numeric datum), and almost all task parameters must be passed on the function call.

- [EthUsdAPIConsumer.sol](contracts/EthUsdAPIConsumer.sol): a contract that requests the the current price of the pair ETH/USD from the **CryptoCompare API** (off-chain data) through an oracle. This contract is very API oriented, by having almost all the adapter task parameters hard-coded (except the oracle address and the job ID).

### Scripts

- [demo_api_requester.js](scripts/demo_api_requester.js): a worthless demonstration of how to request the number of carbohydrates per 100g of watermelon to two different external APIs, using the decentralised oracle network, and aggregating the resulting data.

- [demo_eth_usd_api_consumer.js](scripts/demo_eth_usd_api_consumer.js): shows the process of how to use the **Chainlinked** contract, along its interactions with the decentralised oracle network, for requesting the current price of the pair ETH/USD from an external API.

## Requirements

### 1. NPM Dependencies

```shell
$ npm install
```

### 2. Infura: Sign up and Truffle integration

[Infura](https://infura.io/)

[Using Infura (or a custom provider)](https://www.trufflesuite.com/tutorials/using-infura-custom-provider)

[Truffle HDWalletProvider](https://github.com/trufflesuite/truffle/tree/develop/packages/hdwallet-provider)

Due to the **Chainlink Price Feeds** contracts are in the Ethereum mainnet and some of the testnets, this project contracts must be deployed and used there (in this case **Ropsten**). An alternative to setting up locally your own Ethereum node connected to the **Ropsten** network is to use **Infura**.

1. Sign up in **Infura** (consider enable 2FA via hardware device).

2. Create a new project by clicking `CREATE NEW PROJECT` and name it (e.g. "oracles").

3. Go to the project's dashboard by clicking it in `PROJECTS`.

The `truffle-config.js` is already configured for using **Truffle** to sign transactions and connecting to the **Infura's Ropsten** via the `HDWalletProvider` class. This provider requires some private arguments in a `.env` file (ignored via `.gitignore`):

1. Open the **Truffle development** console and copy the `Mnemonic` (any other mnemonic is valid).

2. Go to the **Infura's** project dashboard and copy the `PROJECT ID`.

3. Create the following `.env` file in the root folder of this project, and fill in the `Mnemonic` and `PROJECT ID`.

```shell
### Accounts mnemonic ###
MNEMONIC_1=<Mnemonic>

### Infura's project###
PROJECT_ID=<PROJECT ID>
ROPSTEN_WSS_ENDPOINT="wss://ropsten.infura.io/ws/v3/${PROJECT_ID}"
```

### 3. (optional) APIs providers: Sign Up and APIs Keys

[Spoonacular API](https://spoonacular.com/food-api)

[USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide.html)

**BEWARE**: the `demo_api_requester.js` script requires to sign up to two APIs (**Spoonacular API** and **USDA FoodData Central API**, both for free) and obtain their API keys. The fact of passing an API key **is a risk**, as it will be stored on-chain, therefore it is totally recommended to take cautions: **sign up with a disposable email and/or generate a new API key**.

Add the API keys in the `.env` file:

```shell
# BEWARE: remember to re-generate te keys!
SPOONACULAR_KEY = <Spoonacular API Key>
USDA_KEY = <USDA API Key>
```

## Usage

### 1. Compile and Migrate contracts

```shell
$ truffle migrate --network ropsten
```

### 2. Run scripts

```shell
$ truffle exec scripts/demo_eth_usd_api_consumer.js --network ropsten
```

```shell
$ truffle exec scripts/demo_api_requester_.js --network ropsten
```

## Tests

[Chainlink Truffle Box](https://github.com/smartcontractkit/box)

[Chainlink Test Helpers](https://www.npmjs.com/package/@chainlink/test-helpers)

This project does not implement tests. For more information about how to implement tests for a **Chainlinked** contract it is recommended to install the **Chainlink Truffle Box** and inspect its tests.
