// SPDX-License-Identifier: CC-BY-NC-SA-4.0
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
pragma solidity 0.6.12;

contract Faucet4 {
    address payable private owner;

    constructor() public {
        owner = msg.sender;
    }

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    modifier onlyOwner {
        // solhint-disable-next-line reason-string
        require(msg.sender == owner);
        _;
    }

    function withdraw(uint256 withdrawAmount) public {
        // solhint-disable-next-line reason-string
        require(withdrawAmount <= 0.1 ether);
        msg.sender.transfer(withdrawAmount);
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}
