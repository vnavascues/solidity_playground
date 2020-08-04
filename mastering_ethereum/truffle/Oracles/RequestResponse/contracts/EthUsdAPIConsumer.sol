// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Mastering Ethereum Chapter 11 Oracles.
 * @author Victor Navascues.
 * @dev An example of a "request-response" oracle but using Chainlink instead
 * of Provable (Oraclize).
 * This contract code is based on:
 *  - Official documentation: "Introduction to Using Any API" code examples.
 *   - https://docs.chain.link/docs/request-and-receive-data
 *  - Remix gist: `ATestnetConsumer.sol`.
 *
 * This requests the latest Ether-USD value provided by CryptoCompare API.
 * Beware the value comes from a single node and a single data provider and
 * it is stored on-chain in this contract.
 * This contract is a "Chainlinked" contract because it inherits from the
 * `ChainlinkClient.sol` contract.
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
contract EthUsdAPIConsumer is ChainlinkClient, Ownable {
    // NB: Testnet cost is 1 LINK
    uint256 private constant PAYMENT = 1 * LINK;
    uint256 public currentPrice;
    uint256 public expiration;

    /**
     * @dev Set the stored address for the LINK token based on the public
     * network that the contract is deployed on.
     */
    constructor() public {
        setPublicChainlinkToken();
    }

    event RequestPriceFulfilled(bytes32 indexed requestId, uint256 price);

    /**
     * @notice Create a Chainlink request to retrieve API response.
     * @dev The set of tasks and their params have been hard-coded because
     * in Chainlink Market there exist several oracles' jobs that use the same
     * sequence for the ETH-USD Cryptocompare API.
     * @param _oracle the oracle contract address.
     * @param _jobId the oracle job identifier for the API call.
     */
    function requestPrice(address _oracle, bytes32 _jobId) public onlyOwner {
        // Job ID, callback address (contract), and callback function signature
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
        req.addInt("times", 100000000); // NB: It could be 100
        sendChainlinkRequestTo(_oracle, req, PAYMENT);
        expiration = block.timestamp + 5 minutes;
    }

    /**
     * @notice Receive the response (USD value of an Ether).
     * @dev Once the oracle has fulfilled the request (including wait for 3
     * block confirmation), it calls back this function with the response data.
     * @dev The event `RequestPriceFulfilled` (that includes the price and
     * allows to look it up via `requestId`) is emitted. The event
     * `ChainlinkFulfilled` is emitted by the `ChainlinkClient` as well but it
     * does not include the price, just the request ID.
     * @param _requestId the request identifier.
     * @param _price the current Ether USD value (but multiplied by 10^8).
     */
    function fulfill(bytes32 _requestId, uint256 _price)
        public
        recordChainlinkFulfillment(_requestId)
    {
        emit RequestPriceFulfilled(_requestId, _price);
        currentPrice = _price;
    }

    /**
     * @notice Cancel a request (e.g. unresponsive node), and retrieve the LINK
     * paid for the unfulfilled request.
     * @dev The default expiration for a request is five minutes, after which
     * it can be cancelled.
     * @dev Payment is hard-coded (from PAYMENT).
     * @param _requestId the request identifier.
     * @param _callbackFunctionSignature the callback function identifier.
     * @param _expiration the expiration timestamp (in seconds).
     */
    function cancelRequest(
        bytes32 _requestId,
        bytes4 _callbackFunctionSignature,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            PAYMENT,
            _callbackFunctionSignature,
            _expiration
        );
    }

    /**
     * @notice Get the ChainLink Token (LINK) contract address.
     * @return the LINK address in the current network.
     */
    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    /**
     * @notice Send this contract current LINK balance to the message sender.
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        // NB: messages no longer than 32 bytes
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "PriceAPIc: Unable to transfer."
        );
    }
}
