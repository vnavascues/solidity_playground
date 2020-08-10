// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import {Mortal} from "./Mortal.sol";

/**
 * @title Mastering Ethereum Chapter 7, Faucet contract.
 * @author Victor Navascues.
 * @notice Controls an Ether faucet.
 * @dev Inherits from Mortal and implements withdrawal.
 */
contract Faucet is Mortal {
    /**
     * @notice Accept any incoming amount.
     * @dev It emits the Diposit event.
     */
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @notice Give out ether to anyone who asks.
     * @dev Limit the withdraw amount to 0.1Ξ. It emits the Withdrawal event.
     * @param withdrawAmount the requested ether amount.
     */
    function withdraw(uint256 withdrawAmount) public {
        require(withdrawAmount <= 0.1 ether);
        // NB: This check increases gas consumption slightly.
        require(
            myAddress.balance >= withdrawAmount,
            "Faucet: Insufficient balance in faucet for withdrawal request."
        );
        msg.sender.transfer(withdrawAmount);
        emit Withdrawal(msg.sender, withdrawAmount);
    }
}
