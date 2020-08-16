// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.6.12;

import {Owned} from "./Owned.sol";

/**
 * @title Mastering Ethereum Chapter 7, Mortal contract.
 * @author Victor Navascues.
 * @notice Enables contract deletion/self destruction.
 * @dev Inherits from Owned and implements contract destruction.
 */
contract Mortal is Owned {
    /**
     * @dev In case `owner` was not payable, call `payable(owner)`.
     */
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}
