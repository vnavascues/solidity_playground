// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import {Owned} from "./Owned.sol";

/**
 * @title Mastering Ethereum Chapter 7, Mortal contract.
 * @author Victor Navascues.
 * @notice Enables contract deletion/self destruction.
 * @dev Inherits from Owned and implements contract destruction.
 */
contract Mortal is Owned {
    // BEWARE: NatSpec comments are not available yet for events.
    /**
     * @notice This event is emitted when a withdrawal occurs.
     * @dev The keyword `indexed` makes the value searchable and filterable.
     * @param to the address that requests the withdrawal.
     * @param amount the requested ether amount.
     */
    event Withdrawal(address indexed to, uint256 amount);
    /**
     * @notice This event is emitted when a diposit occurs.
     * @dev The keyword `indexed` makes the value searchable and filterable.
     * @param from the address that requests the deposit.
     * @param amount the requested ether amount.
     */
    event Deposit(address indexed from, uint256 amount);

    /**
     * @dev In case `owner` was not payable, call `payable(owner)`.
     */
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
    // /**
    //  * @dev In case `owner` was not payable, call `payable(owner)`.
    //  * The keyword `virtual` is because Token contract inherits from this
    //  * contract and overrides this function.
    //  */
    // function destroy() public virtual onlyOwner {
    //     selfdestruct(owner);
    // }
}
