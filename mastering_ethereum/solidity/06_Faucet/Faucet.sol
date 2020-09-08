// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.6.12;

contract Faucet {
    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    function withdraw(uint256 withdrawAmount) public {
        require(withdrawAmount <= 100000000000000000);
        msg.sender.transfer(withdrawAmount);
    }
}
