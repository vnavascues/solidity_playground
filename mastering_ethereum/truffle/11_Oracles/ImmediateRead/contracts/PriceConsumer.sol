// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorInterface.sol";

/**
 * @title Mastering Ethereum Chapter 11 Oracles.
 * @author Victor Navascues.
 * @dev An example of an "immadiate-read" oracle but using Chainlink instead of
 * Provable (Oraclize).
 * This contract code is based on:
 *  - Official documentation: "Get the Latest Price" code example.
 *   - https://docs.chain.link/docs/get-the-latest-price
 *
 * This gets the latest price of an asset stored already on-chain. This value
 * is the result of aggregating (e.g. average, median, etc.) on-chain different
 * values requested via the oracle network (i.e. N nodes) to off-chain APIs
 * (i.e. M data providers).
 */
contract PriceConsumer {
    AggregatorInterface internal trustedPriceFeed;

    /**
     * @dev `AggregatorInterface` is an interface that defines the external
     * functions implemented by Price Feeds.
     * @param _priceFeed the price feed contract address (e.g. ETH/USD contract
     * address in Ropsten).
     */
    constructor(address _priceFeed) public {
        trustedPriceFeed = AggregatorInterface(_priceFeed);
    }

    /**
     * @notice Consume last price data.
     * @return the latest price multiplied by 10^8.
     */
    function getLatestPrice() public view returns (int256) {
        return trustedPriceFeed.latestAnswer();
    }

    /**
     * @notice Consume last price data timestamp.
     * @return the timestamp of the latest price update.
     */
    function getLatestPriceTimestamp() public view returns (uint256) {
        return trustedPriceFeed.latestTimestamp();
    }
}
