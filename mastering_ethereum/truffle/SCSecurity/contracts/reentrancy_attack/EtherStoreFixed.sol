// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Mastering Ethereum Chapter 9, EtherStore fixed contract.
 * @author Victor Navascues.
 * @notice EtherStoreFixed contract prevents reentrancy attacks.
 * @dev Multiple security issues in `withdrawFunds()`  have been addressed.
 * This contract differs from the book implementation in:
 *  - It inherits from oppenzeppelin access `Ownable` contract, implementing
 *  an access modifier in the `collectEther()` function. Just for learning
 *  purposes.
 *
 *  - It implements the mutex logic follwing the Solidity official
 *  documentation example (via modifier, below):
 *    - https://solidity.readthedocs.io/en/v0.6.0/contracts.html?highlight=constructor#function-modifiers
 *
 *  - It implements some Consensys' best practices (link below):
 *    - https://consensys.github.io/smart-contract-best-practices/recommendations
 *
 *    - Contract layout (type declarations, state variables, events, and
 *    functions).
 *    - Mark untrusted contracts. NA.
 *    - Function arguments with leading underscore.
 *    - Log names starting with `Log`.
 *    - Don't use `transfer()` or `send()`.
 *    - Handle errors in external calls.
 *    - Use modifiers only for checks.
 *    - Improved `fallback()` (e.g. simple, log an event, and check data
 *    length). NA.
 *    - Use events to monitor contract activity.
 *    - Lock pragmas to specific compiler version. NA.
 *
 *  - Added the optional message in `require()`.
 *
 *  NB: Ideally it could inherit from openzeppelin token `TokenTimelock`
 *  contract, but it this beyond the exercise of fixing the reentrancy attack.
 */
contract EtherStoreFixed is Ownable {
    bool private locked = false;
    uint256 public withdrawalLimit = 1 ether;
    mapping(address => uint256) public lastWithdrawTime;
    mapping(address => uint256) public balances;

    event LogDepositReceived(address _sender, uint256 _value);
    event LogWithdrawalProcessed(address _sender, uint256 _value);
    // event LogFallbackDepositReceived(address _sender, uint256 _value);

    /**
     * @dev Access control modifier that checks the estate of `locked` before
     * executing the function. It protects the function from reentrant calls.
     */
    modifier noReentrancyMutex {
        require(!locked, "Reentrant call.");
        locked = true;
        _;
        locked = false;
    }

    function depositFunds() external payable {
        balances[msg.sender] += msg.value;
        emit LogDepositReceived(msg.sender, msg.value);
    }

    /**
     * @notice Give out ether to anyone that previously deposited funds via
     * `depositFunds`, and does not withdrawn funds (via this function) at
     * least for a week.
     * @dev List of exploits, vulnerabilities and bad practices addressed:
     *  - Reentrancy attack: addressed via "checks-effects-interaction" pattern
     *  and `noReentrancyMutex` modifier.
     *  - Transferring ether via `call()`: `call()` is kept but it is addressed
     *  via "checks-effects-interaction" pattern, and the `noReentrancyMutex`
     *  modifier.
     * @param _weiToWithdraw the requested ether amount.
     */
    function withdrawFunds(uint256 _weiToWithdraw) public noReentrancyMutex {
        require(
            balances[msg.sender] >= _weiToWithdraw,
            "Insufficient balance."
        );
        require(
            _weiToWithdraw <= withdrawalLimit,
            "Withdrawal limit exceeded."
        );
        require(
            now >= lastWithdrawTime[msg.sender] + 1 weeks,
            "A week has not passed since last withdrawal."
        );

        balances[msg.sender] -= _weiToWithdraw;
        lastWithdrawTime[msg.sender] = now;

        // NB: Don't use `transfer()` or `send()`. Pay attention to reentrancy.
        // msg.sender.transfer(_weiToWithdraw);
        (bool success, ) = msg.sender.call{value: _weiToWithdraw}("");

        require(success, "Failed transaction.");
        emit LogWithdrawalProcessed(msg.sender, _weiToWithdraw);
    }

    // NB: not applicable
    // fallback() external payable {
    //     require(msg.data.length == 0);
    //     emit LogFallbackDepositReceived(msg.sender, msg.value);
    // }
}
