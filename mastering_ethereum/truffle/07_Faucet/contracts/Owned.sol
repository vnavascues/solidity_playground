// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/**
 * @title Mastering Ethereum Chapter 7, Owner contract.
 * @author Victor Navascues.
 * @notice Enables basic access control capabilities.
 * @dev Base contract that sets the contract ownership in the state.
 */
contract Owned {
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
            "Owned: Only the contract owner can call this function."
        );
        _;
    }
}
