# Solidity Playground

[![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

Learning how to make smart contracts in Solidity.

## Contents

- [Mastering Ethereum](mastering_ethereum/README.md): Code from [Mastering Ethereum by Andreas M. Antonopoulos, Gavin Wood](https://github.com/ethereumbook/ethereumbook)

## Requirements

### 1. Solidity Compiler

[Solc](https://solidity.readthedocs.io/en/v0.6.10/installing-solidity.html)

[Solc-select](https://github.com/crytic/solc-select)

[Solc-js](https://github.com/ethereum/solc-js#readme)

This repository requires a global installation of **solc v0.6.10**. Below some options:

- Specific binary release: a specific package, or on demand via **solc-select**.

- Updatable binary release: the snap package.

- NPM package : **solc-js**.

### 2. NPM Dependencies

```shell
$ npm install
```

## Optional requirements

### 1. Node Version Manager

[Node Version Manager](https://github.com/nvm-sh/nvm/blob/master/README.md)

The node version number is in the `.nvmrc` file.
For automatically run the node version specified in the `.nvmrc` file, an option is:

1. Open the virtual environment `.postactivate` script.
2. Paste at the top `nvm use`.
3. Either re-activate the environment or source it using the terminal.

### 2. Python, Virtualenvwrapper & Poetry for MythX & Slither tools

[Virtualenvwrapper](https://virtualenvwrapper.readthedoc)

[Poetry](https://python-poetry.org/)

[MythX CLI](https://github.com/dmuhs/mythx-cli)

[Slither](https://github.com/crytic/slither)

The usage of **MythX CLI** and/or **Slither** is optional. Check their documentation for learning how to use them.

An example of how to set up their environment:

1. Install **virtualenvwrapper**.

2. Create a Python 3 virtual environment (i.e. `solidity_playground`) and activate it.

3. Install the requirements (in `poetry.toml`) via **Poetry** (or comment out the not desired one).

**MythX CLI** requires as well:

1. Sign up in the platform and copy the API key.

2. Open the virtual environment `.postactivate` script and create the `MYTHX_API_KEY` environment variable (i.e. `export MYTHX_API_KEY=<API_KEY>`).

3. Either re-activate the environment or source it using the terminal.

## IDE Plugins & Extensions

### Visual Studio Code

[Solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)

[Solidity Visual Developer](https://marketplace.visualstudio.com/items?itemName=tintinweb.solidity-visual-auditor)

[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## License

This repository is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg
