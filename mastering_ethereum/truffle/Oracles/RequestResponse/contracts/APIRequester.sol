// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

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
 * This PoC contract allows to make requests with some of the most simple
 * adapters (HTTPGet and HTTPPost) without hard-coding the oracle, job, payment
 * api, etc. More information about the adapters below:
 *   - https://docs.chain.link/docs/adapters
 *
 * The function `getAggregatedRequest()` relies on the API Aggregator external
 * adapter. More information below:
 *   - https://market.link/jobs/a0ba2922-4490-41e0-ae82-1bab5591606e
 *
 * The response datum is labelled and stored within the `ResponseData` struct
 * and lookable using the request ID on the `requestIDResponseData` map.
 */
contract APIRequester is ChainlinkClient, Ownable {
    struct ResponseData {
        bytes32 label;
        uint256 value;
    }
    mapping(bytes32 => ResponseData) public requestIDResponseData;

    event RequestFulfilled(
        bytes32 indexed requestId,
        bytes32 label,
        uint256 value
    );

    /**
     * @dev Set the stored address for the LINK token based on the public
     * network that the contract is deployed on.
     */
    constructor() public {
        setPublicChainlinkToken();
    }

    /**
     * @notice Create a Chainlink GET request.
     * @dev The request ID is used as a key on the `requestIDResponseData` map.
     * @param _oracle the oracle contract address.
     * @param _jobId the oracle job identifier for the API call.
     * @param _payment the job cost in LINK.
     * @param _label the name of the requested datum.
     * @param _url the API full URL (including query parameters if necessary).
     * @param _path the route of the response datum in the JSON response data.
     * @param _times the number to multiply with the response datum.
     */
    function getRequest(
        address _oracle,
        bytes32 _jobId,
        uint256 _payment,
        bytes32 _label,
        string memory _url,
        string memory _path,
        int256 _times
    ) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfill.selector
        );
        req.add("get", _url);
        req.add("path", _path);
        req.addInt("times", _times);
        bytes32 requestId = sendChainlinkRequestTo(_oracle, req, _payment);
        ResponseData storage respData = requestIDResponseData[requestId];
        respData.label = _label;
    }

    /**
     * @notice Create a Chainlink GET request (headers optional).
     * @dev The request ID is used as a key on the `requestIDResponseData` map.
     * @param _oracle the oracle contract address.
     * @param _jobId the oracle job identifier for the API call.
     * @param _payment the job cost in LINK.
     * @param _label the name of the requested datum.
     * @param _url the API full URL (including query parameters if necessary).
     * @param _headers the request headers.
     * @param _path the route of the response datum in the JSON response data.
     * @param _times the number to multiply with the response datum.
     */
    function getRequestExt(
        address _oracle,
        bytes32 _jobId,
        uint256 _payment,
        bytes32 _label,
        string memory _url,
        string memory _headers,
        string memory _path,
        int256 _times
    ) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfill.selector
        );
        req.add("get", _url);
        bytes memory headers = bytes(_headers);
        if (headers.length != 0) {
            req.add("headers", _headers);
        }
        req.add("path", _path);
        req.addInt("times", _times);
        bytes32 requestId = sendChainlinkRequestTo(_oracle, req, _payment);
        ResponseData storage respData = requestIDResponseData[requestId];
        respData.label = _label;
    }

    /**
     * @notice Create multiple Chainlink GET request and aggregate the
     * requested values (e.g. mean, median or mode).
     * @dev The request ID is used as a key on the `requestIDResponseData` map.
     * @param _oracle the oracle contract address.
     * @param _jobId the oracle job identifier for the API call.
     * @param _payment the job cost in LINK.
     * @param _label the name of the requested datum.
     * @param _apis the APIs full URLs (including query parameters if necessary).
     * @param _paths the routes of each response datum in the JSON responses data.
     * @param _aggregationType the arithmetic operation to do with the data.
     * @param _times the number to multiply with the aggregated response datum.
     */
    function getAggregatedRequest(
        address _oracle,
        bytes32 _jobId,
        uint256 _payment,
        bytes32 _label,
        string[] memory _apis,
        string[] memory _paths,
        string calldata _aggregationType,
        int256 _times
    ) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfill.selector
        );
        req.addStringArray("api", _apis);
        req.addStringArray("paths", _paths);
        req.add("aggregationType", _aggregationType);
        req.add("copyPath", "aggregateValue");
        req.addInt("times", _times);
        bytes32 requestId = sendChainlinkRequestTo(_oracle, req, _payment);
        ResponseData storage respData = requestIDResponseData[requestId];
        respData.label = _label;
    }

    /**
     * @notice Create a Chainlink POST request (headers optional).
     * @dev The request ID is used as a key on the `requestIDResponseData` map.
     * @param _oracle the oracle contract address.
     * @param _jobId the oracle job identifier for the API call.
     * @param _payment the job cost in LINK.
     * @param _label the name of the requested data.
     * @param _url the API full URL (including query parameters if necessary).
     * @param _headers the request headers.
     * @param _body the request body (check characters escape).
     * @param _path the route of the response datum in the JSON response data.
     * @param _times the number to multiply with the response datum.
     */
    function postRequest(
        address _oracle,
        bytes32 _jobId,
        uint256 _payment,
        bytes32 _label,
        string memory _url,
        string memory _headers,
        string memory _body,
        string memory _path,
        int256 _times
    ) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfill.selector
        );
        req.add("post", _url);
        bytes memory headers = bytes(_headers);
        if (headers.length != 0) {
            req.add("headers", _headers);
        }
        req.add("body", _body);
        req.add("path", _path);
        req.addInt("times", _times);
        bytes32 requestId = sendChainlinkRequestTo(_oracle, req, _payment);
        ResponseData storage respData = requestIDResponseData[requestId];
        respData.label = _label;
    }

    /**
     * @notice Receive the response datum.
     * @dev Once the oracle has fulfilled the request (including wait for 3
     * block confirmation), it calls back this function with the response
     * datum.
     * @dev The value is stored in its struct via the `_requestID`, and the
     * event `RequestFulfilled` is emitted.
     * @param _requestId the request identifier.
     * @param _value the requested datum.
     */
    function fulfill(bytes32 _requestId, uint256 _value)
        public
        recordChainlinkFulfillment(_requestId)
    {
        requestIDResponseData[_requestId].value = _value;
        emit RequestFulfilled(
            _requestId,
            requestIDResponseData[_requestId].label,
            _value
        );
    }

    /**
     * @notice Cancel a request (e.g. unresponsive node), and retrieve the LINK
     * paid for the unfulfilled request.
     * @dev The default expiration for a request is five minutes, after which
     * it can be cancelled.
     * @param _requestId the request identifier.
     * @param _payment the job cost to be refunded in LINK.
     * @param _callbackFunctionSignature the callback function identifier.
     * @param _expiration the expiration timestamp (in seconds).
     */
    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionSignature,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            _payment,
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
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "APIReq: Unable to transfer."
        );
    }
}
