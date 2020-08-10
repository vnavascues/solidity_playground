# Mastering Ethereum - Truffle - 07_Token

## Contents

### Contracts

**BEWARE**: the contracts have been implemented using Solidity v0.6.

The following contracts are the same than the ones in the [07_Token](./../solidity/07_Token/README.md) folder but within a **Truffle** project:

- [Faucet.sol](build/contracts/Faucet.sol)

- [Mortal.sol](build/contracts/Mortal.sol)

- [Owned.sol](build/contracts/Owned.sol)

- [Token.sol](build/contracts/Token.sol)

### Scripts

- [demo_faucet.js](scripts/demo_faucet.js): shows contracts and EOA balances, before and after funding the `Faucet`, and after withdrawing the as well.

- [gas_estimates.js](scripts/gas_estimates.js): estimates the gas cost of `Faucet.sol::withdrawal()`.

## Requirements

### 1. NPM Dependencies

```shell
$ npm install
```

### 2. Ganache

[Ganache](https://www.trufflesuite.com/ganache)

This project has two environments set up in `truffle-config.js`: **development** and **dev** (preferred). The former is already provided by **Truffle**, whilst the latter requires a local instance of **Ganache**. Check its documentation for installing it and load this project.

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
