//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./dexs/IWrapper.sol";
import "./OpenMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OpenRouter is Ownable {
    using OpenMath;
    IWrapper[] dexs;
    IERC20[] supportedTokens;
    mapping(address -> string) dexNames;
    uint256 numTokens;

    function addAmm(address dexAddress, string name) external onlyOwner {
        require(dexNames[dexAddress] == "", "DEX has alread been added");
        known[dexAddress] = name;
        dexs.push(dexAddress);
    }

    function addToken(address newToken) external onlyOwner {
        for (uint i = 0; i < supportedTokens.length; i++) {
            require(supportedTokens[i] != newToken, "Token already added");
        }
        supportedTokens.add(newToken);
        numTokens++;
    }

    function getBestExchange(address tokenIn, address tokenOut, uint256 amountIn) public view returns (int256 rate, address exchange) {
        uint256 amountOut = 0;
        for (uint i = 0; i < dexs.length; i++) {
            uint256 quote = ISwap(dexs[i]).getQuote(tokenIn, tokenOut, amountIn);
            if (quote > amountOut) {
                amountOut = quote;
                exchange = dexs[i];
            }
        }
        rate = OpenMath.exchangeRate(amountIn, amountOut)
    }

    function fillBoard(uint256 tokenFromIndex, uint256 amountIn) public view returns (int256[][] memory exchangeRates, address[][] exchanges, int256[] memory pathTo) {
        exchangeRates = new int256[][](numTokens)(numTokens);
        exchanges = new address[][](numTokens)(numTokens);
        pathTo = new int256(numTokens);

        for (uint i = 0; i < numTokens; i++) {
            pathTo[i] = OpenMath.MAX_INT;
            if (i == tokenFromIndex) {
                pathTo[i] = 0;
            }
            for (uint i = 0; i < numTokens; i++) {
                IERC20 tokenIn = supportedTokens[i]
                for (uint j = 0; j < numTokens; j++) {
                    (int256 rate, address exchange) = getBestExchange(tokenIn, supportedTokens[j], 10 ** tokenIn.decimals())
                    exchanges[i][j] = exchange;
                    exchangeRates[i][j] = OpenMath.log2(-1 * rate);
                }
            }

        }

        {
            bool improved = true;
            uint iteration = 0;
            while (iteration < numTokens - 1 && improved) {
                improved = false;
                iteration++;
                for (uint i = 0; i < numTokens; i++) {
                    int256 curCost = pathTo[i]
                    for (uint j = 0; j < numTokens; j++) {
                        if (curCost + exchangeRates[i][j] < pathTo[j]) {
                            pathTo[j] = curCost + exchangeRates[i][j];
                            improved = true;
                        }
                    }
                }
            }
        }
    }

}