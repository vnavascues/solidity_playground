# Mastering Ethereum - Truffle

## Contents

- [07_CallExamples](07_CallExamples/README.md): shows the different ways of calling a library/contract function (Chapter 7).

- [07_Faucet](07_Faucet/README.md): the Faucet project (Chapter 7).

- [09_SCSecurity](09_SCSecurity/README.md): examples of smart contract vulnerabilities and how to address them (Chapter 9).

- [10_Tokens](10_Tokens/README.md): the ERC20 token project (Chapter 10).

- [11_Oracles](11_Oracles/README.md): contracts that interact with a decentralised network of oracles (Chapter 11).

## Requirements

### NPM Dependencies

```shell
$ npm install
```

## Optional Requirements

### 1. Truffle v5

[Truffle](https://www.trufflesuite.com/docs/truffle/overview)

This repository will install **Truffle** locally (dependency in `package.json`), but it can be installed globally (check the documentation).
Each truffle project in this repository contains its own **Truffle** configuration file (`truffle-config.js`).

### 2. Solidity Compiler

[Solc](https://solidity.readthedocs.io/en/v0.6.12/installing-solidity.html)

[Solc-js](https://github.com/ethereum/solc-js#readme)

[Solc-select](https://github.com/crytic/solc-select)

**Truffle** projects with a specific compiler version in their configuration file use **solc-js** (NPM package installed locally) under the hood for installing the compiler. All the projects listed above use this system with **solc-js v0.6.12**. Below some alternatives with global installations:

- Specific binary release: a **specific package**, or on demand via **solc-select**.

- Updatable binary release: the **snap package**.
