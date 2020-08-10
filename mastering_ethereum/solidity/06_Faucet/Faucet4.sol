// SPDX-License-Identifier: MIT
/*
Why:
  - Constructor keyword (remember it only runs once, during contract creation).
  - Selfdestruct function (allows the contract destruction).

What:
  - Constructor sets the owner variable (checked by selfdestruct).
  - Destroy function must be called by the contract creator (for obvious
  reasons), refunds the owner address with any remaining balance, and the
  storage and code is removed from the state.
    - Do not use "tx.origin".
  - Modifier onlyOwner for DIY. Modifiers are commonly used for acces control.

*/
pragma solidity ^0.6.0;

contract Faucet4 {
    address payable private owner;

    constructor() public {
        owner = msg.sender;
    }

    receive() external payable {}

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function withdraw(uint256 withdrawAmount) public {
        require(withdrawAmount <= 0.1 ether);
        msg.sender.transfer(withdrawAmount);
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}