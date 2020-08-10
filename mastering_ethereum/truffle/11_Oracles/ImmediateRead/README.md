# Mastering Ethereum - Truffle - 11_Oracles - ImmediateRead

## Contents

### Contracts

**BEWARE**: the contracts have been implemented using Solidity v0.6.

[Chainlink Developers Documentation](https://docs.chain.link/docs)

[Chainlink GitHub](https://github.com/smartcontractkit/chainlink)

[Chainlink Contracts](https://www.npmjs.com/package/@chainlink/contracts)

[Chainlink Price Feeds](https://docs.chain.link/docs/reference-contracts)

[Chainlink Price Reference Data](https://feeds.chain.link/)

[Chainlink Ropsten ETH/USD](https://ropsten.etherscan.io/address/0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507)

This project implements in **Truffle** (instead of in **Remix IDE**) the following **Chainlink Developer Documentation - Using Price Feeds** tutorials:

- [Get the Latest Price Data](https://docs.chain.link/docs/historical-price-data)

- [Historical Price Data](https://docs.chain.link/docs/historical-price-data)

For using the **Chainlink Price Feeds** a contract requires:

- Inherit from the `AggregatorInterface.sol` **Chainlink contracts**.

- The **price feed contract address**.

This project uses **Ropsten ETH/USD Price Feed** contract. Check [2_PriceConsumer.js](migrations/2_PriceConsumer.js) and [3_HistoricalPriceConsumer.js](migrations/3_HistoricalPriceConsumer.js) migrations.

- [HistoricalPriceConsumer.sol](build/contracts/HistoricalPriceConsumer.sol): a contract that retrieves the historical price of the pair ETH/USD (data already stored on-chain).

- [PriceConsumer.sol](build/contracts/PriceConsumer.sol): a contract that retrieves the current price of the pair ETH/USD (data already stored on-chain).

### Scripts

- [demo_price_feed.js](scripts/demo_price_feed.js): shows the interactions between the price consumer contracts and the ETH/USD price feed **Ropsten** contract.

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

## Usage

### 1. Compile and Migrate contracts

```shell
$ truffle migrate --network ropsten
```

### 2. Run scripts

```shell
$ truffle exec scripts/demo_price_feed.js --network ropsten
```
