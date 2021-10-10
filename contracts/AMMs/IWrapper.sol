//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IWrapper {
  function getQuotes(address tokenIn, uint256 amountIn)
    public
    view
    returns (address[] memory tokensOut, uint256[] amountsOut);

  function getQuote(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
  ) public view returns (uint256);

  function swap(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 minAmountOut
  ) public returns (uint256);
}
