// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Mastering Ethereum Chapter 10, METoken contract.
 * @author Victor Navascues.
 * @notice METoken contract has been adapted to the new ERC20 standards.
 * @dev OZ @openzeppelin/contracts >= 2.0 has renamed "StandardToken.sol" as
 * "ERC20.sol". More information below:
 *  - https://docs.openzeppelin.com/contracts/2.x/erc20
 *  - https://github.com/trufflesuite/trufflesuite.com/blob/master/src/tutorials/robust-smart-contracts-with-openzeppelin.md
 */
contract METoken is ERC20 {
    // NB: Declarations not needed if they can be passed as an argument.
    string private constant NAME = "Mastering Ethereum Token";
    string private constant SYMBOL = "MET";
    uint8 private constant DECIMALS = 2;
    uint256 private constant INITIAL_SUPPLY = 2100000000;

    /**
     * @dev List of changes regarding original METoken constructor:
     *  - Constructor linearization rules, and arguments for the base
     *  constructor (ERC20).
     *  - `decimals` is not an ERC20 argument, but it must be set up via
     * `_setupDecimals()` during construction.
     *  - `_mint()` sets up the `_totalSupply`, and `_balances` and emits the
     *  `Transfer` event.
     */
    constructor() public ERC20(NAME, SYMBOL) {
        _setupDecimals(DECIMALS);
        _mint(_msgSender(), INITIAL_SUPPLY);
    }
}
