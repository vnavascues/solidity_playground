// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Mastering Ethereum Chapter 10, METFaucet contract.
 * @author Victor Navascues.
 * @dev Two withdraw functions have been implemented for testing the difference
 * between `ERC20.transfer()` and `ERC20.transferFrom()`. The former has been
 * tested by approving METFaucet address (via `approve()`) with some MET.
 */
contract METFaucet {
    ERC20 public trustedMEToken;
    uint256 public withdrawalLimit = 1000;
    address public metOwner;

    constructor(address _trustedMEToken, address _metOwner) public {
        metOwner = _metOwner;
        trustedMEToken = ERC20(_trustedMEToken);
    }

    /**
     * @notice Transfer MET from the METFaucet balances (in METoken) to the
     * sender.
     * @dev Due to this function calls `transfer()` it requires:
     *  - Transfer some MET to the METFaucet address (add balance).
     * The withdrawn amount will come from the METFaucet balances in METoken.
     * @param _withdrawAmount the requested MET amount.
     */
    function withdrawViaTransfer(uint256 _withdrawAmount) public {
        require(
            _withdrawAmount <= withdrawalLimit,
            "Withdrawal limit exceeded."
        );
        trustedMEToken.transfer(msg.sender, _withdrawAmount);
    }

    /**
     * @notice Transfer MET from the METoken owner balances (in METoken) to the
     * sender.
     * @dev Due to this function calls `transferFrom()` it requires:
     *  - Approve an amount of MET for the METFaucet address.
     * The withdrawn amount will come from the owner balances in METoken.
     * @param _withdrawAmount the requested MET amount.
     */
    function withdrawViaTransferFrom(uint256 _withdrawAmount) public {
        require(
            _withdrawAmount <= withdrawalLimit,
            "Withdrawal limit exceeded."
        );
        trustedMEToken.transferFrom(metOwner, msg.sender, _withdrawAmount);
    }
}
