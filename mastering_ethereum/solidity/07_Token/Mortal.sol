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
