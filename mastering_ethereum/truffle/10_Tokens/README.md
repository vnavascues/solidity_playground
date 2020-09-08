# Mastering Ethereum - Truffle - 10_Tokens

## Contents

### Contracts

**BEWARE**: contracts implemented with Solidity v0.6.12.

[OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)

- [METFaucet.sol](contracts/METFaucet.sol): the `METFaucet.sol` contract but with two withdraw functions: one using `transfer()` and the other using `transferFrom()`.

- [METoken.sol](contracts/METoken.sol): the last version of `METoken.sol` but inheriting from the **OpenZeppelin** `ERC20.sol` token contract instead of the `StandardToken.sol` contract (deprecated).

### Scripts

- [demo_metoken.js](scripts/demo_metoken.js): shows different interactions between an EOA, an ERC20 token faucet, and an ERC20 token.

## Requirements

### 1. NPM Dependencies

```shell
$ npm install
```

### 2. Ganache

[Ganache](https://www.trufflesuite.com/ganache)

This project has a **Ganache** environment (**development**) set up in `truffle-config.js`. Check its documentation to see how install it and load this project.

## Usage

### 1. Compile and Migrate contracts

```shell
$ npm run migrate
```

### 2. Run scripts

```shell
$ npm run demo:metoken
```
