// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Mastering Ethereum Chapter 11 Oracles.
 * @author Victor Navascues.
 * @dev An example of a "request-response" oracle but using Chainlink instead
 * of Provable (Oraclize).
 * This contract, copied from the Chainlink Request & Receive Data code
 * examples, makes a request to an external API (via a node operator Job). This
 * contract is a "Chainlinked" contract because it inherits from the
 * `ChainlinkClient` contract.
 *  - https://docs.chain.link/docs/request-and-receive-data
 *
 * List of services (Chainlink nodes):
 *  - https://docs.chain.link/docs/listing-services
 *
 * Chainlink Market provides a list of nodes and jobs. The Ropsten jobs below:
 *  - https://market.link/search/jobs?search=ropsten
 *
 * The job chosen for this code is `ETH-USD CryptoCompare`:
 *  - https://market.link/jobs/d1178a2c-d090-4396-9b09-5f278cfaa155
 *  - Oracle contract address: 0x83F00b902cbf06E316C95F51cbEeD9D2572a349a
 *  - Node Job Id: d00773d991984ceda7902304b324c718
 *  - Cost: 1.0 LINK
 *
 * This job tasks list are:
 *   1. HTTP Get
 *     - "get": "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
 *   2. JSON Parse
 *     - "path": "USD"
 *   3. Multiply
 *     - "times": "100000000"
 *   4. ETH Uint256
 *   5. ETH Transaction
 *
 * Contract address:
 *  - Ropsten: 0x66e1d52805695DDaf8D7835F45cE196D7827b559
 */
contract PriceAPIConsumer is ChainlinkClient, Ownable {
    // NB: Testnet cost is 1 LINK
    uint256 private constant PAYMENT = 1 * LINK;
    uint256 public currentPrice;

    constructor() public {
        setPublicChainlinkToken();
    }

    event RequestPriceFulfilled(bytes32 indexed requestId, uint256 price);

    function requestPrice(address _oracle, bytes32 _jobId) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfill.selector
        );
        req.add(
            "get",
            "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
        );
        req.add("path", "USD");
        req.addInt("times", 100000000);
        sendChainlinkRequestTo(_oracle, req, PAYMENT);
    }

    function fulfill(bytes32 _requestId, uint256 _price)
        public
        recordChainlinkFulfillment(_requestId)
    {
        emit RequestPriceFulfilled(_requestId, _price);
        currentPrice = _price;
    }

    function cancelRequest(
        bytes32 _requestId,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            PAYMENT,
            _callbackFunctionId,
            _expiration
        );
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "ChainlinkExample: Unable to transfer."
        );
    }
}
