// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/**
 * @title Mastering Ethereum Chapter 6, Faucet contract v5.
 * @author Victor Navascues.
 * @notice Faucet4 applying contract inheritance, error handling, events, and
 * NatSpec documentation.
 * @dev Base contract that sets the contract ownership in the state.
 */
contract Owned5 {
    /**
     * @dev The keyword `payable` is optional (it can be casted later on via
     * `payable(owner)`, and `internal` for inheritance.
     */
    address payable internal owner;
    /**
     * @dev contract address, the keyword keyword `internal` for inheritance.
     */
    address internal myAddress = address(this);

    constructor() public {
        owner = msg.sender;
    }

    /**
     * @dev Access control modifier that checks the message address against the
     * contract creator one.
     */
    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Owned5: Only the contract owner can call this function."
        );
        _;
    }
}
