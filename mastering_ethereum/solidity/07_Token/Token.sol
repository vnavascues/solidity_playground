// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.6.12;

import {Faucet} from "./Faucet.sol";
import {Mortal} from "./Mortal.sol";

/**
 * @title Mastering Ethereum Chapter 7, Token contract.
 * @author Victor Navascues.
 * @notice On its creation withdraws 0.1 Ether from Faucet.
 * @dev Inherits from Mortal and uses Faucet.
 */
contract Token is Mortal {
    Faucet private _faucet;

    // constructor() public {
    //     // NB: statement not valid becase Faucet constructor is not payable
    //     // _faucet = (new Faucet){value: 0.5 ether}();
    //     _faucet = new Faucet();
    //     address(_faucet).transfer(0.5 ether);
    // }

    // NB: Constructor alternative instantiating the Faucet contract via its
    // existing contract address
    // constructor(address payable _f) public {
    //     // NB: Faucet constructor would require an address argument.
    //     _faucet = Faucet(_f);
    //     _faucet.withdraw(0.1 ether);
    // }

    constructor(address _f) public {
        // NB: Faucet constructor would require an address argument.
        _faucet = Faucet(payable(_f));
        _faucet.withdraw(0.1 ether);
    }

    // /**
    //  * @dev The keyword `override` is required if overriding `destroy`.
    //  */
    // function destroy() public override onlyOwner {
    //     _faucet.destroy();
    // }
}
