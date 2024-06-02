// SPDX-License-Identifier: ISC
pragma solidity ^0.8.0;

import "./MobiusBaseBurner.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MobiusCeloBurner is MobiusBaseBurner {
  IERC20 constant CELO = IERC20(0x471EcE3750Da237f93B8E339c536989b8978a438);

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
      CELO
    )
  {}
}
