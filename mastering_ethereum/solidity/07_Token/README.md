# Mastering Ethereum - Solidity - 07_Token

## Contents

### Contracts

**BEWARE**: the contracts have been implemented using Solidity v0.6.

- [Faucet.sol](Faucet.sol): the [Faucet5.sol](./../06_Faucet/Faucet.sol) contract.

- [Mortal.sol](Mortal.sol): the [Mortal5.sol](./../06_Faucet/Mortal5.sol) contract.

- [Owned.sol](Owned.sol): the [Owned5.sol](./../06_Faucet/Owned5.sol) contract.

- [Token.sol](Token.sol): the `Token.sol` contract version which constructor requires the Faucet contract's address to be passed as an argument.

## Usage

More information about how to use **solc** and **solc-js** in their official documentation:

- [Solc](https://solidity.readthedocs.io/en/v0.6.10/using-the-compiler.html)

- [Solc-js](https://github.com/ethereum/solc-js#readme)

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
$ npx solcjs --optimize --bin Owned.sol Mortal.sol Faucet.sol Token.sol
```

### 3. Compile to produce the contract's ABI

Single contract:

```shell
$ npx solcjs --abi Owned.sol
```

Multiple contracts with inheritance:

```shell
$ npx solcjs --abi Owned.sol Mortal.sol Faucet.sol Token.sol
```
