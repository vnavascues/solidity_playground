# Mastering Ethereum - Truffle - 07_Token

## Contents

### Contracts

**BEWARE**: contracts implemented with Solidity v0.6.12.

- [Faucet.sol](contracts/Faucet.sol)

- [Mortal.sol](contracts/Mortal.sol)

- [Owned.sol](contracts/Owned.sol)

- [Token.sol](contracts/Token.sol)

### Scripts

- [demo_faucet.js](scripts/demo_faucet.js): shows contracts and EOA balances, before and after funding the `Faucet`, and after withdrawing it.

- [gas_estimates.js](scripts/gas_estimates.js): estimates the gas cost of `Faucet.sol::withdrawal()`.

## Requirements

### 1. NPM Dependencies

```shell
$ npm install
```

### 2. Ganache

[Ganache](https://www.trufflesuite.com/ganache)

This project has two environments set up in `truffle-config.js`: **development** and **dev** (preferred). The former is already provided by **Truffle**, whilst the latter requires a local instance of **Ganache**. Check its documentation to see how install it and load this project.

## Usage

### 1. Compile and Migrate contracts

```shell
$ truffle migrate --network dev
```

### 2. Run scripts

```shell
$ truffle exec scripts/demo_faucet.js
```

```shell
$ truffle exec scripts/gas_estimates.js
```
