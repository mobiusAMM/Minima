//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Iwrapper.sol"
import "@openzeppelin/contracts/ownership/Ownable.sol";
import './openzeppelin-contracts@3.4.0/contracts/token/ERC20/IERC20.sol';

interface IUbeswapRouter {
    function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external return (uint[] memory amounts);

    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure virtual returns (uint amountOut);

    function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts);

    function pairFor(address tokenA, address tokenB) public view returns (address)
}

interface IPair {
    address public token0;
    address public token1;

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast);
}

contract UbeswapWrapper is IWrapper, Ownable {
    public constant address ubeswap = IUbeswapRouter(address(0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121))
    public address[] supportedTokens;

    constructor(address[] calldata initialSupportedTokens) {
        this.supportedTokens = initialSupportedTokens;
    }

    function getQuote(address tokenIn, address tokenOut, uint256 amountIn) pure view returns (uint256) {
        address pair = IPair(ubeswap.pairFor(tokenIn, tokenOut));
        (uint256 reserveIn, uint256 reserveOut, ) = pair.getReserves();
        if (tokenIn != pair.token0) {
            uint256 temp = reserveIn;
            reserveIn = reserveOut;
            reserveOut = temp;
        }
        return ubeswap.getAmountOut(amountIn, reserveIn, reserveOut);
    }

    function getQuotes(
        address tokenIn,
        uint256 amountIn
    ) public view returns (uint256[] memory expectedOut, uint256[] supportedTokens) {
        address[] memory supportedTokens = this.supportedTokens;
        uint256[supportedTokens.length] memory expectedOut;

        for (uint i = 0; i < supportedTokens.length; i++) {
            address tokenOut = supportedTokens[i];
            if (tokenOut == tokenIn) {
                expectedOut[i] = 0;
            } else {
                expectedOut[i] = getQuote(tokenIn, tokenOut, amountIn)
            }
        }
    }

    function addSupportedTokens(address[] calldata tokens) public onlyOwner {
        address[] storage currentlySupportedTokens = this.supportedTokens;
        for (uint i = 0; i < tokens.length; i++) {
            currentlySupportedTokens.push(tokens[i])
        }
    }

  function swap(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 minAmountOut
  ) public returns (uint256) {
        address[2] memory path = [tokenIn, tokenOut];
        uint time = block.timestamp;
        IERC20(tokenIn).transferFrom(msg.sender, address(this));
        require(IERC20(tokenIn).approve(address(ubeswap), amountIn), "Approval failed");
        uint[] memory amounts = ubeswap.swapExactTokensForTokens(amountIn, minAmountOut, path, msg.sender, time + 30);
        return amounts[amounts.length - 1];
  }
}