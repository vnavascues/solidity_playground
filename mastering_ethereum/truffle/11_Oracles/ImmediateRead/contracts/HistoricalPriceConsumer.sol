// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.6.12;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorInterface.sol";

/**
 * @title Mastering Ethereum Chapter 11 Oracles.
 * @author Victor Navascues.
 * @dev An example of an "immadiate-read" oracle but using Chainlink instead of
 * Provable (Oraclize).
 * This contract code is based on:
 *  - Official documentation: "Historical Price Data" code example.
 *   - https://docs.chain.link/docs/historical-price-data
 *  - Remix gist: `HistoricalPriceConsumer.sol`.
 *
 * This gets the previous price of an asset stored already on-chain. This value
 * is the result of aggregating (e.g. average, median, etc.) on-chain different
 * values requested via the oracle network (i.e. N nodes) to off-chain APIs
 * (i.e. M data providers).
 */
contract HistoricalPriceConsumer {
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

    function getLatestRound() public view returns (uint256) {
        return trustedPriceFeed.latestRound();
    }

    /**
     * @notice Get the price at `latestRound` minus `_back` rounds.
     * @param _back is the amount of rounds substracted (round delta).
     * @return the previous price multiplied by 10^8.
     */
    function getPreviousPrice(uint256 _back) public view returns (int256) {
        uint256 latest = trustedPriceFeed.latestRound();
        require(
            _back <= latest,
            "HistoricalPriceConsumer: Not enough history."
        );
        return trustedPriceFeed.getAnswer(latest - _back);
    }

    /**
     * @notice Get the price timestamp at `latestRound` minus `_back` rounds.
     * @param _back is the amount of rounds substracted (round delta).
     * @return the timestamp of the previous price.
     */
    function getPreviousPriceTimestamp(uint256 _back)
        public
        view
        returns (uint256)
    {
        uint256 latest = trustedPriceFeed.latestRound();
        require(
            _back <= latest,
            "HistoricalPriceConsumer: Not enough history."
        );
        return trustedPriceFeed.getTimestamp(latest - _back);
    }
}
