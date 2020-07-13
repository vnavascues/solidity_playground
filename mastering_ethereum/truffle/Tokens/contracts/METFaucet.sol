// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Mastering Ethereum Chapter 10, MEFaucet contract.
 * @author Victor Navascues.
 * @dev OZ @openzeppelin/contracts >= 2.0 has renamed "StandardToken.sol" as
 * "ERC20.sol". More information below:
 *  - https://docs.openzeppelin.com/contracts/2.x/erc20
 *  - https://github.com/trufflesuite/trufflesuite.com/blob/master/src/tutorials/robust-smart-contracts-with-openzeppelin.md
 */
contract MEFaucet {
    ERC20 public trustedMEToken;
    address public metOwner;

    constructor(address _metToken, address _metOwner) public {
        trustedMEToken = new ERC20(_metToken);
        metOwner = _metOwner;
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(_withdrawAmount <= 1000, "Max _withdrawAmount is 1000.");
        trustedMEToken.transferFrom(METOwner, msg.sender, _withdrawAmount);
    }
}
