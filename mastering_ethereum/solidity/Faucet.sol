// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Faucet {
    receive() external payable {}

    function withdraw(uint256 withdrawAmount) public {
        require(withdrawAmount <= 100000000000000000);
        msg.sender.transfer(withdrawAmount);
    }
}
