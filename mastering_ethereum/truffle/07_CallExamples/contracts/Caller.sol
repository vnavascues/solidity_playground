// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.6.12;

import {Called} from "./Called.sol";
import {CalledLibrary} from "./CalledLibrary.sol";

contract Caller {
    event LogLowLevelCalls(address sender, bool success, bytes response);

    function makeCalls(Called _called) public {
        // Calling Called and CalledLibrary directly
        _called.calledFunction();
        CalledLibrary.calledFunction();

        // Low-level calls using the address object for Called
        // NB: prior Solidity 0.5.0
        // require(address(_called).call(bytes4(keccak256("calledFunction()"))));
        // require(address(_called).delegatecall(bytes4(keccak256("calledFunction()"))));

        bool success;
        bytes memory response;

        // bytes memory functionSig = abi.encodePacked(
        //     bytes4(keccak256("calledFunction()"))
        // );
        bytes memory functionSig = abi.encodeWithSignature("calledFunction()");

        // NB: Solidity >= 0.5.0, capturing `call` and `delegatecall` returns
        // in variables
        // solhint-disable-next-line avoid-low-level-calls
        (success, response) = address(_called).call(functionSig);
        // solhint-disable-next-line reason-string
        require(success);
        emit LogLowLevelCalls(msg.sender, success, response);

        // solhint-disable-next-line avoid-low-level-calls
        (success, response) = address(_called).delegatecall(functionSig);
        // solhint-disable-next-line reason-string
        require(success);
        emit LogLowLevelCalls(msg.sender, success, response);
    }
}
