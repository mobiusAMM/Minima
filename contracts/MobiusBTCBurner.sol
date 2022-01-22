// SPDX-License-Identifier: ISC
pragma solidity ^0.8.0;

import "./MobiusBaseBurner.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MobiusBTCBurner is MobiusBaseBurner {
  IERC20 constant wBTC = IERC20(0xBAAB46E28388d2779e6E31Fd00cF0e5Ad95E327B);

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
      wBTC
    )
  {}
}
