// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.6.12;

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
        // solhint-disable-next-line reason-string
        require(msg.sender == owner, "Only owner");
        _;
    }
}
