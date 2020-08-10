# Mastering Ethereum - Truffle - 00_CallExamples

This project does not belong to the book.

## Contents

### Contracts

**BEWARE**: the contracts have been implemented using Solidity v0.6.

- [Called.sol](build/contracts/Called.sol): a contract with the function `calledFunction()` that emits the event `CallEvent`.

- [CalledLibrary.sol](build/contracts/CalledLibrary.sol): a library contract with the function `calledFunction()` that emits the event `CallEvent`.

- [Caller.sol](build/contracts/Caller.sol): a contract that does calls in different ways `CalledLibrary.sol::calledFunction` and `CalledLibrary.sol::calledFunction` (i.e. straight call, `call()` and `delegatecall()`).

### Scripts

- [demo_calls.js](scripts/reentrancy_attack/demo_ethersorefaulty.js): shows a cascade of events that reflect the different consequences of calling library/contract functions via the instances methods, `call()`, and `delegatecall()`.

- [gas_estimates.js](scripts/gas_estimates.js): estimates the gas cost of `Caller.sol::makeCalls()`.

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
$ truffle exec scripts/demo_calls.js
```

```shell
$ truffle exec scripts/gas_estimates.js
```
