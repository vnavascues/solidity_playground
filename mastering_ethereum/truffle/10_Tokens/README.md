# Mastering Ethereum - Truffle - 10_Tokens

## Contents

### Contracts

**BEWARE**: the contracts have been implemented using Solidity v0.6.12.

[OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)

- [METFaucet.sol](build/contracts/METFaucet.sol): the book's `METFaucet.sol` contract but with two withdraw functions: one using `<METoken>.transfer()` and the other one using `<METoken>.transferFrom()`.

- [METoken.sol](build/contracts/METoken.sol): the last version of `METoken.sol` but inheriting from the **OpenZeppelin** `ERC20.sol` token contract instead of the `StandardToken.sol` contract (deprecated).

### Scripts

- [demo_metoken.js](scripts/demo_metoken.js): shows different interactions between an EOA, an ERC20 token faucet, and an ERC20 token.

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
$ truffle exec scripts/demo_metoken.js
```
