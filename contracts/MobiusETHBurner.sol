// SPDX-License-Identifier: ISC
pragma solidity ^0.8.0;

import "./MobiusBaseBurner.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MobiusEthBurner is MobiusBaseBurner {
  IERC20 constant WETH = IERC20(0x122013fd7dF1C6F636a5bb8f03108E876548b455);

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
      WETH
    )
  {}
}
