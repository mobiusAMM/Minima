// SPDX-License-Identifier: ISC
pragma solidity ^0.8.0;

import "./MobiusBaseBurner.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MobiusEurBurner is MobiusBaseBurner {
  IERC20 constant cEUR = IERC20(0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73);

  constructor(
    address _emergencyOwner,
    address _receiver,
    address _recoveryReceiver,
    IWrapper _mobiusWrapper,
    Minima _router
  )
    MobiusBaseBurner(
      _emergencyOwner,
      _receiver,
      _recoveryReceiver,
      _mobiusWrapper,
      _router,
      cEUR
    )
  {}
}
