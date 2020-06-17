// SPDX-License-Identifier: MIT
/*
Why:
  - Apply contract inheritance over Faucet_4.sol.

What:
  - Faucet has contract generic functionalities that can be moved into an
  another base contract to inherit from.
  - BEWARE: for convenience sake all contracts will reside in this file.
*/
pragma solidity ^0.6.10;

contract Owned {
    address payable owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}

contract Mortal is Owned {
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}

contract Faucet is Mortal {
    receive() external payable {}

    function withdraw(uint256 withdraw_amount) public {
        require(withdraw_amount <= 0.1 ether);
        msg.sender.transfer(withdraw_amount);
    }
}
