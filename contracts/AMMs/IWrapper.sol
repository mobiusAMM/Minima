//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IWrapper {
  function getQuotes(address tokenIn, uint256 amountIn)
    external
    view
    returns (uint256[] memory expectedOut, address[] memory tokensOut);

  function getQuote(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
  ) external view returns (uint256);

  function swap(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 minAmountOut
  ) external returns (uint256);
}
