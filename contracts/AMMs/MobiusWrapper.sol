// SPDX-License-Identifier: ISC

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IWrapper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISwap {
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
  mapping(address => mapping(address => address)) public tokenRoute; // token in => token out => swap address
  mapping(address => bool) public swapContained;

  function addSwapContract(address swapAddress, uint256 numTokens)
    public
    onlyOwner
    returns (bool)
  {
    if (swapContained[swapAddress]) return false;

    swapContained[swapAddress] = true;

    ISwap swap = ISwap(swapAddress);
    address[] memory tokens = new address[](numTokens);
    for (uint256 i = 0; i < numTokens; i++) {
      tokens[i] = swap.getToken(uint8(i));
    }

    // This is technically quadratic, but the number of tokens for a swap contract will *hopefully*
    // be around 2 or 3
    for (uint256 i = 0; i < numTokens; i++) {
      address token_i = tokens[i];
      for (uint256 j = 0; j < numTokens; j++) {
        if (j != i) {
          address token_j = tokens[j];
          tokenRoute[token_i][token_j] = swapAddress;
        }
      }
    }
    return true;
  }

  function addMultipleSwapContracts(
    address[] calldata contracts,
    uint256[] calldata numTokens
  ) external onlyOwner {
    require(contracts.length == numTokens.length, "Array lengths vary");
    for (uint256 i = 0; i < contracts.length; i++) {
      addSwapContract(contracts[i], numTokens[i]);
    }
  }

  function getTradeIndices(address tokenFrom, address tokenTo)
    public
    view
    returns (
      uint256 tokenIndexFrom,
      uint256 tokenIndexTo,
      address swapAddress
    )
  {
    swapAddress = tokenRoute[tokenFrom][tokenTo];
    tokenIndexFrom = 0;
    tokenIndexTo = 0;
    if (swapAddress != address(0)) {
      ISwap swap = ISwap(swapAddress);
      tokenIndexFrom = swap.getTokenIndex(tokenFrom);
      tokenIndexTo = swap.getTokenIndex(tokenTo);
    }
  }

  function _getQuote(
    uint256 tokenIndexFrom,
    uint256 tokenIndexTo,
    uint256 amountIn,
    address swapAddress
  ) internal view returns (uint256) {
    ISwap swap = ISwap(swapAddress);
    return
      swap.calculateSwap(uint8(tokenIndexFrom), uint8(tokenIndexTo), amountIn);
  }

  function getQuote(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
  ) external view override returns (uint256) {
    (
      uint256 tokenIndexFrom,
      uint256 tokenIndexTo,
      address swapAddress
    ) = getTradeIndices(tokenIn, tokenOut);
    if (swapAddress == address(0)) {
      return 0; // Or => OpenMath.MAX_UINT;
    }
    return _getQuote(tokenIndexFrom, tokenIndexTo, amountIn, swapAddress);
  }

  function swap(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 minAmountOut
  ) external override returns (uint256) {
    (
      uint256 tokenIndexFrom,
      uint256 tokenIndexTo,
      address swapAddress
    ) = getTradeIndices(tokenIn, tokenOut);
    require(swapAddress != address(0), "Swap contract does not exist");
    ISwap swap = ISwap(swapAddress);
    uint256 time = block.timestamp;

    IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
    require(IERC20(tokenIn).approve(swapAddress, amountIn), "Approval failed");

    uint256 actualAmountOut = swap.swap(
      uint8(tokenIndexFrom),
      uint8(tokenIndexTo),
      amountIn,
      minAmountOut,
      time + 30
    );
    IERC20(tokenOut).transfer(msg.sender, actualAmountOut);
    return actualAmountOut;
  }
}
