# Mastering Ethereum - Solidity - 06_Faucet

## Contents

### Contracts

**BEWARE**: contracts implemented with Solidity v0.6.12.

- [Faucet.sol](Faucet.sol): first example of `Faucet.sol`, a Solidity contract implementing a faucet.

- [Faucet4.sol](Faucet4.sol): fourth version of `Faucet.sol`. It implements an access modifier and a destroy function.

- [Faucet5.sol](Faucet5.sol): custom version of `Faucet8.sol`, but applying contract inheritance, and **NatSpec** documentation.

- [Mortal5.sol](Mortal5.sol): `Mortal.sol` from the `Faucet8.sol` contract.

- [Owned5.sol](Owned5.sol): `Owned.sol` from the `Faucet8.sol` contract.

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
