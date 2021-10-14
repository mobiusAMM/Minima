//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IWrapper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../OpenMath.sol";

interface ISwap {
  using OpenMath;

  function getTokenIndex(address tokenAddress) external view returns (uint8);
  function getToken(uint8 index) external view returns (address);

  function calculateSwap(
    uint8 tokenIndexFrom,
    uint8 tokenIndexTo,
    uint256 dx
  ) external view returns (uint256);


  function swap(
    uint8 tokenIndexFrom,
    uint8 tokenIndexTo,
    uint256 dx,
    uint256 minDy,
    uint256 deadline
  ) external returns (uint256);
}

contract MobiusWrapper is IWrapper, Ownable {
    mapping(address -> address[]) tokensToSwap; // token in --> swap contracts
    mapping(address -> (mapping address -> address)) tokenRoute; // token in -> token out -> swap address
    mapping(address -> bool) swapContained; 

    function addSwapContract(address swapAddress, uint256 numTokens) external onlyOwner {
      require(!swapContained[swapAddress], "This swap contract has already been added!");

      ISwap swap = ISwap(swapAddress);
      address[] memory tokens = new address[](numTokens);
      for (uint i = 0; i < numTokens; i++) {
        tokens[i] = swap.getToken(i);
      } 

      // This is technically quadratic, but the number of tokens for a swap contract will *hopefully*
      // be around 2 or 3
      for (uint i = 0; i < numTokens; i++) {
        address token_i = tokens[i];
        swapContracts[token_i].push(swap);
        for (uint j = i + 1; j < numTokens; j++) {
          address token_j = tokens[j];
          tokenRoute[token_i][token_j] = swapAddress;
        }
      }
    }

    function getTradeIndices(address tokenFrom, address tokenTo) public view returns (uint tokenIndexFrom, uint tokenIndexTo, address swapAddress) {
      swapAddress = tokenRoute[tokenFrom][tokenTo];
      tokenIndexFrom = 0;
      tokenIndexTo = 0;
      if (swapAddress != 0) {
        ISwap swap = ISwap(swapAddress);
        tokenIndexFrom = swap.getTokenIndex(tokenIn);
        tokenIndexTo = swap.getTokenIndex(tokenOut);
      }
    }

    function _getQuote(uint tokenIndexFrom, uint tokenIndexTo, uint amountIn, address swapAddress) internal returns (uint256) {
      ISwap swap = ISwap(swapAddress);
      return swap.calculateSwap(tokenIndexFrom, tokenIndexTo, amountIn);
    }

    function getQuote(address tokenIn, address tokenOut, uint256 amountIn) external returns (uint256) {
      (uint tokenIndexFrom, uint tokenIndexTo, address swapAddress) = getTradeIndices(tokenIn, tokenOut);
      if (swapAddress == address(0)) {
        return 0; // Or -> OpenMath.MAX_UINT;
      }
      return _getQuote(tokenIndexFrom, tokenIndexTo, amountIn, swapAddress);
    }

    function swap(
      address tokenIn,
      address tokenOut,
      uint256 amountIn,
      uint256 minAmountOut
    ) external override returns (uint256) {
      (uint tokenIndexFrom, uint tokenIndexTo, address swapAddress) = getTradeIndices(tokenIn, tokenOut);
      require (swapAddress != address(0), "Swap contract does not exist");
      ISwap swap = ISwap(swapAddress);
      uint256 time = block.timestamp;

      IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
      require(
        IERC20(tokenIn).approve(address(ubeswap), amountIn),
        "Approval failed"
      );

      uint actualAmountOut = swap.swap(tokenIndexFrom, tokenIndexTo, amountIn, minAmountOut, time + 30);
      IERC20(tokenOut).transfer(msg.sender, actualAmountOut);
      return actualAmountOut;
    }

}