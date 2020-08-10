// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import {Mortal5} from "./Mortal5.sol";

/**
 * @title Mastering Ethereum Chapter 6, Faucet contract v5-8.
 * @author Victor Navascues.
 * @notice Faucet4 applying contract inheritance, error handling, events, and
 * NatSpec documentation.
 * @dev Inherits from Mortal5 and implements withdrawal.
 */
contract Faucet5 is Mortal5 {
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
            "Insufficient balance in faucet for withdrawal request"
        );
        msg.sender.transfer(withdrawAmount);
        emit Withdrawal(msg.sender, withdrawAmount);
    }
}
