// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.0;

contract D {
    uint256 public n;
    address public sender;

    function callSetN(address _e, uint256 _n) public {
        // NB: prior Solidity 0.5.0
        // _e.call(bytes4(keccak256("setN(uint256)")), _n);

        // NB: Solidity >= 0.5.0, capturing `call` returns in variables
        // (bool success, bytes memory data) = _e.call(abi.encodeWithSignature("setN(uint256)", _n));

        // NB: removed unused variables
        _e.call(abi.encodeWithSignature("setN(uint256)", _n)); // E's storage is set, D is not modified
    }

    /* DEPRECATED: use`delegateCall` instead of `callcode`
  function callcodeSetN(address _e, uint _n) public {
     // NB: prior Solidity 0.5.0
    // _e.callcode(bytes4(keccak256("setN(uint256)"), _n); // D's storage is set, E is not modified
  }
  */

    function delegatecallSetN(address _e, uint256 _n) public {
        // NB: prior Solidity 0.5.0
        // _e.delegatecall(bytes4(keccak256("setN(uint256)")), _n);

        // NB: Solidity >= 0.5.0, capturing `call` returns in variables
        // (bool success, bytes memory data) = _e.delegatecall(abi.encodeWithSignature("setN(uint256)", _n));

        // NB: removed unused variables
        _e.delegatecall(abi.encodeWithSignature("setN(uint256)", _n)); // E's storage is set, D is not modified
    }
}

contract E {
    uint256 public n;
    address public sender;

    function setN(uint256 _n) public {
        n = _n;
        sender = msg.sender;
        // msg.sender is D if invoked by D's callcodeSetN. None of E's storage is updated
        // msg.sender is C if invoked by C.foo(). None of E's storage is updated

        // the value of "this" is D, when invoked by either D's callcodeSetN or C.foo()
    }
}

contract C {
    function foo(
        D _d,
        E _e,
        uint256 _n
    ) public {
        _d.delegatecallSetN(address(_e), _n);
    }
}
