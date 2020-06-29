// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Called {
    event CallEvent(address sender, address origin, address from);

    function calledFunction() public {
        emit CallEvent(msg.sender, tx.origin, address(this));
    }
}
