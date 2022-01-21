// SPDX-License-Identifier: ISC
pragma solidity ^0.8.0;

import "./IWrapper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ILendingPool {
  function deposit(
    address asset,
    uint256 amount,
    address onBehalfOf,
    uint16 referralCode
  ) external;

  function withdraw(
    address asset,
    uint256 amount,
    address to
  ) external;
}

contract MoolaWrapper is IWrapper, Ownable {
  ILendingPool lendingPool =
    ILendingPool(0x970b12522CA9b4054807a2c5B736149a5BE6f670);
  mapping(address => address) pairs; // underlying  => receiptToken

  function addAsset(address underlying, address receiptToken)
    external
    onlyOwner
  {
    require(pairs[underlying] == address(0), "Asset pair already listed");
    pairs[underlying] = receiptToken;
  }

  function _underlying(address tokenIn, address tokenOut)
    internal
    view
    returns (
      address underlying,
      address receipt,
      bool isDeposit
    )
  {
    underlying = tokenIn;
    receipt = tokenOut;
    isDeposit = true;
    if (pairs[tokenOut] == tokenIn) {
      underlying = tokenOut;
      receipt = tokenIn;
      isDeposit = false;
    }
  }

  function getQuote(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
  ) external view override returns (uint256) {
    if (pairs[tokenIn] == tokenOut || pairs[tokenOut] == tokenIn) {
      return amountIn; // The asset pair exists, so in one atomic action can be swapped 1:1
    }
    return 0;
  }

  function swap(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 minAmountOut
  ) external override returns (uint256) {
    (address underlying, address receipt, bool isDeposit) = _underlying(
      tokenIn,
      tokenOut
    );
    require(pairs[underlying] == receipt, "Pair does not exist");

    IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
    require(
      IERC20(tokenIn).approve(address(lendingPool), amountIn),
      "Approval failed"
    );
    uint256 balanceBefore = IERC20(tokenOut).balanceOf(address(this));

    if (isDeposit) {
      lendingPool.deposit(tokenIn, amountIn, address(this), 0);
    }
    uint256 actualAmountOut = IERC20(tokenOut).balanceOf(address(this)) -
      balanceBefore;

    IERC20(tokenOut).transfer(msg.sender, actualAmountOut);
    return actualAmountOut;
  }
}
