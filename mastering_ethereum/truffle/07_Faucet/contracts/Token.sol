// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

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
