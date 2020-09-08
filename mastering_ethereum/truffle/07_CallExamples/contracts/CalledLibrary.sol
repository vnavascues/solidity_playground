// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.6.12;

library CalledLibrary {
    event CallEvent(address sender, address origin, address from);

    function calledFunction() public {
        // solhint-disable-next-line avoid-tx-origin
        emit CallEvent(msg.sender, tx.origin, address(this));
    }
}
