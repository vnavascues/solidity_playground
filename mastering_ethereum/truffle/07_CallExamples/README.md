# Mastering Ethereum - Truffle - 07_CallExamples

## Contents

### Contracts

**BEWARE**: contracts implemented with Solidity v0.6.12.

- [Called.sol](contracts/Called.sol): a contract with the function `calledFunction()` that emits the event `CallEvent`.

- [CalledLibrary.sol](contracts/CalledLibrary.sol): a library contract with the function `calledFunction()` that emits the event `CallEvent`.

- [Caller.sol](contracts/Caller.sol): a contract that calls `CalledLibrary.sol::calledFunction` and `CalledLibrary.sol::calledFunction` in different ways (i.e. straight call, `call()` and `delegatecall()`).

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

This project has a **Ganache** environment (**development**) set up in `truffle-config.js`. Check its documentation to see how install it and load this project.

## Usage

### 1. Compile and Migrate contracts

```shell
$ npm run migrate
```

### 2. Run scripts

```shell
$ npm run demo:calls
```

```shell
$ npm run demo:gas_estimates
```
