// SPDX-License-Identifier: ISC

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./AMMs/IWrapper.sol";
import "./OpenMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Minima is Ownable {
  using OpenMath for *;
  address[] public dexs;
  address[] public supportedTokens;
  mapping(address => bool) public dexKnown;
  uint256 public numTokens;

  event TokenAdded(address token);
  event DexAdded(address dex, string name);
  event Swap(
    address tokenFrom,
    address tokenTo,
    uint256 amountIn,
    uint256 amountOut
  );

  constructor(address[] memory initialTokens, address[] memory initialDexes) {
    for (uint256 i = 0; i < initialTokens.length; i++) {
      supportedTokens.push(initialTokens[i]);
      numTokens++;
    }
    for (uint256 i = 0; i < initialDexes.length; i++) {
      dexKnown[initialDexes[i]] = true;
      dexs.push(initialDexes[i]);
    }
  }

  function addDex(address dexAddress, string calldata name) external onlyOwner {
    require(!dexKnown[dexAddress], "DEX has alread been added");
    dexKnown[dexAddress] = true;
    dexs.push(dexAddress);
    emit DexAdded(dexAddress, name);
  }

  function addToken(address newToken) external onlyOwner {
    for (uint256 i = 0; i < supportedTokens.length; i++) {
      require(supportedTokens[i] != newToken, "Token already added");
    }
    supportedTokens.push(newToken);
    numTokens++;
    emit TokenAdded(newToken);
  }

  function getBestExchange(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
  ) public view returns (uint256 rate, address exchange) {
    uint256 amountOut = 0;
    for (uint256 i = 0; i < dexs.length; i++) {
      uint256 quote = IWrapper(dexs[i]).getQuote(tokenIn, tokenOut, amountIn);
      if (quote > amountOut) {
        amountOut = quote;
        exchange = dexs[i];
      }
    }
    rate = OpenMath.exchangeRate(amountIn, amountOut);
  }

  function getTokenIndex(address token) internal view returns (uint256) {
    for (uint256 i = 0; i < numTokens; i++) {
      if (address(supportedTokens[i]) == token) {
        return i;
      }
    }
    revert("Token not supported");
  }

  function getExpectedOutFromPath(
    address[] memory tokenPath,
    address[] memory exchangePath,
    uint256 amountIn
  ) public view returns (uint256 expectedOut) {
    require(tokenPath.length > 1, "Path must contain atleast two tokens");
    require(
      exchangePath.length == tokenPath.length - 1,
      "Exchange path incorrect length"
    );

    expectedOut = amountIn;
    uint256 i = 0;
    while (i < exchangePath.length && exchangePath[i] != address(0)) {
      expectedOut = IWrapper(exchangePath[i]).getQuote(
        tokenPath[i],
        tokenPath[++i],
        expectedOut
      );
    }
  }

  function getExpectedOut(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
  )
    external
    view
    returns (
      uint256 amountOut,
      address[] memory tokenPath,
      address[] memory exchangePath
    )
  {
    uint256 tokenFromIndex = getTokenIndex(tokenIn);
    uint256 tokenOutIndex = getTokenIndex(tokenOut);

    (
      address[][] memory exchanges,
      uint256[] memory parents,
      bool arbExists
    ) = fillBoard(tokenFromIndex);
    (
      address[] memory _tokenPath,
      address[] memory _exchangePath
    ) = getPathFromBoard(tokenFromIndex, tokenOutIndex, exchanges, parents);
    tokenPath = _tokenPath;
    exchangePath = _exchangePath;
    amountOut = getExpectedOutFromPath(tokenPath, exchangePath, amountIn);
  }

  function fillBoard(uint256 tokenFromIndex)
    public
    view
    returns (
      address[][] memory exchanges,
      uint256[] memory parents,
      bool arbExists
    )
  {
    int256[][] memory exchangeRates = new int256[][](numTokens);
    int256[] memory pathTo = new int256[](numTokens);
    exchanges = new address[][](numTokens);
    parents = new uint256[](numTokens);

    for (uint256 i = 0; i < numTokens; i++) {
      pathTo[i] = OpenMath.MAX_INT;
      exchangeRates[i] = new int256[](numTokens);
      exchanges[i] = new address[](numTokens);
      if (i == tokenFromIndex) {
        pathTo[i] = 0;
      }
      ERC20 tokenIn = ERC20(supportedTokens[i]);
      uint256 decimals = 10**tokenIn.decimals();
      for (uint256 j = 0; j < numTokens; j++) {
        (uint256 rate, address exchange) = getBestExchange(
          supportedTokens[i],
          supportedTokens[j],
          100 * decimals
        );
        exchanges[i][j] = exchange;
        exchangeRates[i][j] = rate == 0
          ? OpenMath.MAX_INT
          : -1 * OpenMath.log_2(rate);
      }
    }

    uint256 iteration = 0;
    {
      bool improved = true;
      while (iteration < numTokens && improved) {
        improved = false;
        iteration++;
        for (uint256 i = 0; i < numTokens; i++) {
          int256 curCost = pathTo[i];
          if (curCost != OpenMath.MAX_INT) {
            for (uint256 j = 0; j < numTokens; j++) {
              if (
                exchangeRates[i][j] < OpenMath.MAX_INT &&
                curCost + exchangeRates[i][j] < pathTo[j]
              ) {
                pathTo[j] = curCost + exchangeRates[i][j];
                improved = true;
                parents[j] = i;
              }
            }
          }
        }
        if (iteration == numTokens) {
          arbExists = improved;
        }
      }
    }
  }

  function getPathFromBoard(
    uint256 tokenFromIndex,
    uint256 tokenOutIndex,
    address[][] memory exchanges,
    uint256[] memory parents
  )
    public
    view
    returns (address[] memory tokenPath, address[] memory exchangePath)
  {
    address[] memory backPath = new address[](numTokens);
    address[] memory backExchPath = new address[](numTokens - 1);
    tokenPath = new address[](numTokens);
    exchangePath = new address[](numTokens - 1);
    uint256 curIndex = tokenOutIndex;
    uint256 iterations = 0;

    while (curIndex != tokenFromIndex) {
      require(iterations < numTokens, "No path exists");
      uint256 parent = parents[curIndex];
      backPath[iterations] = supportedTokens[curIndex];
      backExchPath[iterations++] = exchanges[parent][curIndex];
      curIndex = parent;
    }

    tokenPath[0] = supportedTokens[tokenFromIndex];
    for (uint256 i = 1; i <= iterations; i++) {
      tokenPath[i] = backPath[iterations - i];
      exchangePath[i - 1] = backExchPath[iterations - i];
    }
  }

  // To do - add check for 0x0 address in exchangePath
  function swap(
    address[] memory tokenPath,
    address[] memory exchangePath,
    uint256 amountIn,
    uint256 minAmountOut,
    address recipient
  ) public returns (uint256 actualAmountOut) {
    require(tokenPath.length > 1, "Path must contain atleast two tokens");
    require(
      exchangePath.length == tokenPath.length - 1,
      "Exchange path incorrect length"
    );
    IERC20 inputToken = IERC20(tokenPath[0]);
    require(
      inputToken.transferFrom(msg.sender, address(this), amountIn),
      "Transfer failed"
    );
    actualAmountOut = amountIn;
    uint256 i = 0;
    while (i < exchangePath.length && exchangePath[i] != address(0)) {
      address exchange = exchangePath[i];
      inputToken = IERC20(tokenPath[i]);
      IERC20 outToken = IERC20(tokenPath[++i]);
      uint256 startingBalance = outToken.balanceOf(address(this));
      require(inputToken.approve(exchange, actualAmountOut), "Approval failed");

      IWrapper(exchange).swap(
        address(inputToken),
        address(outToken),
        actualAmountOut,
        0
      );
      actualAmountOut = outToken.balanceOf(address(this)) - startingBalance;
    }
    require(actualAmountOut >= minAmountOut, "Slippage was too high");
    IERC20(tokenPath[i]).transfer(recipient, actualAmountOut);
    emit Swap(tokenPath[0], tokenPath[i], amountIn, actualAmountOut);
  }

  function swapOnChain(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 minAmountOut,
    address recipient
  ) external returns (uint256) {
    uint256 tokenFromIndex = getTokenIndex(tokenIn);
    uint256 tokenOutIndex = getTokenIndex(tokenOut);

    (address[][] memory exchanges, uint256[] memory parents, ) = fillBoard(
      tokenFromIndex
    );

    (
      address[] memory tokenPath,
      address[] memory exchangePath
    ) = getPathFromBoard(tokenFromIndex, tokenOutIndex, exchanges, parents);
    return swap(tokenPath, exchangePath, amountIn, minAmountOut, recipient);
  }
}
