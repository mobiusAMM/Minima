//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IWrapper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUbeswapRouter {
  function swapExactTokensForTokens(
    uint256 amountIn,
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
  ) external returns (uint256[] memory amounts);

  function getAmountOut(
    uint256 amountIn,
    uint256 reserveIn,
    uint256 reserveOut
  ) external pure returns (uint256 amountOut);

  function getAmountsOut(uint256 amountIn, address[] memory path)
    external
    view
    returns (uint256[] memory amounts);

  function pairFor(address tokenA, address tokenB)
    external
    view
    returns (address);
}

interface IPair {
  function token0() external view returns (address);

  function token1() external view returns (address);

  function getReserves()
    external
    view
    returns (
      uint112 _reserve0,
      uint112 _reserve1,
      uint32 _blockTimestampLast
    );
}

contract UbeswapWrapper is IWrapper, Ownable {
  IUbeswapRouter public constant ubeswap =
    IUbeswapRouter(address(0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121));
  address[] public supportedTokens;

  function _getQuote(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
  ) internal view returns (uint256) {
    IPair pair = IPair(ubeswap.pairFor(tokenIn, tokenOut));
    (uint256 reserveIn, uint256 reserveOut, ) = pair.getReserves();
    if (tokenIn != pair.token0()) {
      uint256 temp = reserveIn;
      reserveIn = reserveOut;
      reserveOut = temp;
    }
    return ubeswap.getAmountOut(amountIn, reserveIn, reserveOut);
  }

  function getQuote(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
  ) external view override returns (uint256) {
    return _getQuote(tokenIn, tokenOut, amountIn);
  }

  function getQuotes(address tokenIn, uint256 amountIn)
    external
    view
    returns (uint256[] memory expectedOut, address[] memory tokensOut)
  {
    tokensOut = supportedTokens;
    expectedOut = new uint256[](supportedTokens.length);

    for (uint256 i = 0; i < supportedTokens.length; i++) {
      address tokenOut = supportedTokens[i];
      if (tokenOut == tokenIn) {
        expectedOut[i] = 0;
      } else {
        expectedOut[i] = _getQuote(tokenIn, tokenOut, amountIn);
      }
    }
  }

  function addSupportedTokens(address[] calldata tokens) external onlyOwner {
    address[] storage currentlySupportedTokens = supportedTokens;
    for (uint256 i = 0; i < tokens.length; i++) {
      currentlySupportedTokens.push(tokens[i]);
    }
  }

  function swap(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 minAmountOut
  ) external override returns (uint256) {
    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;
    uint256 time = block.timestamp;
    IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
    require(
      IERC20(tokenIn).approve(address(ubeswap), amountIn),
      "Approval failed"
    );
    uint256[] memory amounts = ubeswap.swapExactTokensForTokens(
      amountIn,
      minAmountOut,
      path,
      msg.sender,
      time + 30
    );
    return amounts[amounts.length - 1];
  }
}
