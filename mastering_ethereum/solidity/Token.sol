// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import {Faucet5} from "./Faucet5.sol";
import {Mortal5} from "./Mortal5.sol";

contract Token is Mortal5 {
    Faucet5 private _faucet;

    // constructor() public {
    //     // NB: statement not valid becase Faucet5 constructor is not payable
    //     // _faucet = (new Faucet5){value: 0.5 ether}();
    //     _faucet = new Faucet5();
    //     address(_faucet).transfer(0.5 ether);
    // }

    // NB: Constructor alternative instantiating the Faucet5 contract via its
    // existing contract address
    // constructor(address payable _f) public {
    //     // NB: Faucet5 constructor would require an address argument.
    //     _faucet = Faucet5(_f);
    //     _faucet.withdraw(0.1 ether);
    // }

    constructor(address _f) public {
        // NB: Faucet5 constructor would require an address argument.
        _faucet = Faucet5(payable(_f));
        _faucet.withdraw(0.1 ether);
    }

    // /**
    //  * @dev The keyword `override` is required if overriding `destroy`.
    //  */
    // function destroy() public override onlyOwner {
    //     _faucet.destroy();
    // }
}
