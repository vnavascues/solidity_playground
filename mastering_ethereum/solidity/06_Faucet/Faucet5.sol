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
    // BEWARE: NatSpec comments are not available yet for events.
    /**
     * @notice This event is emitted when a withdrawal occurs.
     * @dev The keyword `indexed` makes the value searchable and filterable.
     * @param to the address that requests the withdrawal.
     * @param amount the requested ether amount.
     */
    event Withdrawal(address indexed to, uint256 amount);
    /**
     * @notice This event is emitted when a diposit occurs.
     * @dev The keyword `indexed` makes the value searchable and filterable.
     * @param from the address that requests the deposit.
     * @param amount the requested ether amount.
     */
    event Deposit(address indexed from, uint256 amount);

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
