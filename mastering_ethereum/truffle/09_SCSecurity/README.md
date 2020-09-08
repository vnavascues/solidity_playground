# Mastering Ethereum - Truffle - 09_SCSecurity

## Contents

### Contracts

**BEWARE**: contracts implemented with Solidity v0.6.12.

#### Reentrancy Attack

[Consensys' Ethereum Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

[OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)

The "fixed" version of the contracts use the **OpenZeppelin** `Ownable.sol` contract instead of implementing their own access control modifier.

- [AttackFaulty.sol](contracts/reentrancy_attack/AttackFaulty.sol): a contract that exploits the reentrancy vulnerability of `EtherStoreFaulty.sol`.

- [EtherStoreFaulty.sol](contracts/reentrancy_attack/EtherStoreFixed.sol): a contract with a reentrancy vulnerability in `withdrawFunds()`.

- [AttackFixed.sol](contracts/reentrancy_attack/AttackFixed.sol): a better implementation of `AttackFaulty.sol` introducing some of the best practices on smart contracts implementation (e.g. **Consensys**' best practices).

- [EtherStoreFixed.sol](contracts/reentrancy_attack/EtherStoreFixed.sol): the `EtherStoreFaulty.sol` contract with the preventative techniques applied along with best practices.

### Scripts

#### Reentrancy Attack

- [demo_ethersorefaulty.js](scripts/reentrancy_attack/demo_ethersorefaulty.js): shows a successful reentrancy attack.

- [demo_etherstorefixed.js](scripts/reentrancy_attack/demo_etherstorefixed.js): shows a failed reentrancy attack.

### Tests

[Jest](https://jestjs.io/)

[OpenZeppelin Test Environment](https://github.com/OpenZeppelin/openzeppelin-test-environment)

[OpenZeppelin Test Helpers](https://github.com/OpenZeppelin/openzeppelin-test-helpers)

**BEWARE**: this test suite uses **Jest** as a test runner, **OpenZeppelin Test Environment** as a testing environment, and **OpenZeppelin Test Helpers** as an assertion library. It requires a particular set up found in `jest.config.js` and `test-environment_config.js`. Another alternative could be use **Mocha** and **Chai**, and **Truffle Assertions**.

#### Reentrancy Attack

- [AttackFaulty.test.js](tests/reentrancy_attack/AttackFaulty.test.js): a set of unit (contract implementation) and integration (`EtherStoreFaulty.sol` exploit) tests for `AttackFaulty.sol`.

- [EtherStoreFaulty.test.js](tests/reentrancy_attack/EtherStoreFaulty.test.js): a set of unit tests for `EtherStoreFaulty.sol`.

- [AttackFixed.test.js](tests/reentrancy_attack/AttackFixed.test.js): a set of unit (contract implementation) and integration (`EtherStoreFixed.sol` failed exploit) tests for `AttackFixed.sol`.

- [EtherStoreFixed.test.js](tests/reentrancy_attack/EtherStoreFixed.test.js): a set of unit tests for `EtherStoreFixed.sol`.

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
$ npm run demo:reentrancy:faulty
```

```shell
$ npm run demo:reentrancy:fixed
```

### 3. Run tests

**BEWARE**: any contract change will require to compile them again (`$ npx truffle compile`) before running the tests.

Run all the tests (optionally `$ npx jest`):

```shell
$ npm test
```

Run a test file:

```shell
$ npm test EtherStoreFaulty.test.js
```

Run a group of tests via `jest-runner-groups` (check the group names in the tests files):

```shell
$ npm test -- --group=fixed
```

```shell
$ npm test -- --group=reentrancy_attack
```
