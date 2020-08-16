# Mastering Ethereum - Solidity - 06_Faucet

## Contents

### Contracts

**BEWARE**: the contracts have been implemented using Solidity v0.6.12

- [Faucet.sol](Faucet.sol): the first example of `Faucet.sol`, a Solidity contract implementing a faucet.

- [Faucet4.sol](Faucet4.sol): the fourth version of `Faucet.sol`. It implements an access modifier and a destroy function.

- [Faucet5.sol](Faucet5.sol): a custom version of the `Faucet8.sol` book's contract, but applying contract inheritance,and NatSpec documentation.

- [Mortal5.sol](Mortal5.sol): the `Mortal.sol` contract from the book's `Faucet8.sol`.

- [Owned5.sol](Owned5.sol): the `Owned.sol` contract from the book's `Faucet8.sol`.

## Usage

- [Solc](https://solidity.readthedocs.io/en/v0.6.12/using-the-compiler.html)

- [Solc-js](https://github.com/ethereum/solc-js#readme)

Check **solc** and **solc-js** documentation to see how to use them:

### 1. Get solc-js version

```shell
$ npx solcjs --version
```

### 2. Compile to produce the contract's binary (optimised)

Single contract:

```shell
$ npx solcjs --optimize --bin Faucet.sol
```

Multiple contracts with inheritance:

```shell
$ npx solcjs --optimize --bin Owned5.sol Mortal5.sol Faucet5.sol
```

### 3. Compile to produce the contract's ABI

Single contract:

```shell
$ npx solcjs --abi Owned5.sol
```

Multiple contracts with inheritance:

```shell
$ npx solcjs --abi Owned5.sol Mortal5.sol Faucet5.sol
```
