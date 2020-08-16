// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.6.12;

/**
 * @title Mastering Ethereum Chapter 9, EtherStore faulty contract.
 * @author Victor Navascues.
 * @notice EtherStoreFaulty contract enables reentrancy attack.
 * @dev Function `withdrawFunds()` has an exploit via reentrancy attack by do
 * not applying the "checks-effects-interaction" pattern.
 */
contract EtherStoreFaulty {
    uint256 public withdrawalLimit = 1 ether;
    mapping(address => uint256) public lastWithdrawTime;
    mapping(address => uint256) public balances;

    function depositFunds() external payable {
        balances[msg.sender] += msg.value;
    }

    /**
     * @notice Give out ether to anyone that previously deposited funds via
     * `depositFunds`, and does not withdrawn funds (via this function) at
     * least for a week.
     * @dev List of exploits, vulnerabilities and bad practices below:
     *  - Reentrancy attack: balances and timestamp updated are
     *  updated after the externall call. No checks-effects-interaction
     *  pattern.
     *
     *  - Transferring ether via `call()`: it is an unnecessary and risky
     *  low-level call for transferring funds (it can be exploited by a
     *  malicious fallback function of the contract caller). The `call()`:
     *    - Has not limit on the gas available.
     *    - It also consumes a large amount of gas.
     *
     *  By using `transfer()` the fallback function can only rely on 2300 gas
     *  being available. Consensys has some discrepancies about using
     *  `send()/transfer()` rather than `call()`, because of the gas cost
     *  changes (more info below):
     *    - https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/
     *    - https://ethereum.stackexchange.com/questions/19341/address-send-vs-address-transfer-best-practice-usage
     *
     *  - `now` (alias of `block.timestamp`): it is not a reliable source of
     *  time-based decisions for the business logic because it can be
     *  influenced by the miners to some degree (it seems `now` will be
     *  deprecated by `block.timestamp` soon). If using `block.timestamp`
     *  consider checking the current block timestamp must be strictly larger
     *  than the timestamp of the last block (more info below):
     *      - https://solidity.readthedocs.io/en/v0.5.3/units-and-global-variables.html#block-and-transaction-properties
     *
     * @param _weiToWithdraw the requested ether amount.
     */
    function withdrawFunds(uint256 _weiToWithdraw) public {
        require(balances[msg.sender] >= _weiToWithdraw);
        require(_weiToWithdraw <= withdrawalLimit);
        require(now >= lastWithdrawTime[msg.sender] + 1 weeks);

        // NB: attacking vector
        (bool success, ) = msg.sender.call{value: _weiToWithdraw}("");
        require(success);

        balances[msg.sender] -= _weiToWithdraw;
        lastWithdrawTime[msg.sender] = now;
    }
}
