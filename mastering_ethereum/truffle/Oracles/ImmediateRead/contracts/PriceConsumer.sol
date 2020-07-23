// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorInterface.sol";

/**
 * @title Mastering Ethereum Chapter 11 Oracles.
 * @author Victor Navascues.
 * @dev An example of an "immadiate-read" oracle but using Chainlink instead of
 * Orazclize.
 * This contract, copied from the Chainlink Price Feeds code examples, gets the
 * latest price of an asset.
 *  - https://docs.chain.link/docs/using-chainlink-reference-contracts
 *
 * Contract addresses
 *  - Ropsten: 0x8fDff122b446660B85F757e7aDc0D63feb41dcA8
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
