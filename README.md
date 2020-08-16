# Solidity Playground

[![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

Learning how to make smart contracts in Solidity.

## Contents

- [Mastering Ethereum](mastering_ethereum/README.md): Code from [Mastering Ethereum by Andreas M. Antonopoulos, Gavin Wood](https://github.com/ethereumbook/ethereumbook)

## Requirements

### NPM Dependencies

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

### 2. Python, Virtualenvwrapper & Poetry for Manticore, MythX & Slither tools

[Virtualenvwrapper](https://virtualenvwrapper.readthedoc)

[Poetry](https://python-poetry.org/)

[Solc-select](https://github.com/crytic/solc-select)

[Manticore](https://github.com/trailofbits/manticore)

[MythX CLI](https://github.com/dmuhs/mythx-cli)

[Slither](https://github.com/crytic/slither)

**Manticore**, **MythX CLI** and **Slither** are different analysis tools of smart contracts and binaries, and its usage is optional (check their documentation to see how they work). They require **Python 3.6 or greater** and recommend a **Python virtual environment**.

An example of how to set up their environment:

1. Install **Python 3.6 or greater**.

2. Install **virtualenvwrapper**, create a virtual environment (i.e. `solidity_playground`) and activate it.

3. Install the requirements (in `poetry.toml`) via **Poetry** (or comment out the not desired one).

**Manticore** requires a global installation of **solc** (Solidity compiler) that matches the one specified in the contracts. An option can be:

1. Install **solc-select**.

2. Open the virtual environment `.postactivate` script and add the command `solc use <solc_version>` (e.g. `solc use 0.6.12`).

3. Either re-activate the environment or source it using the terminal.

**MythX CLI** requires:

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
