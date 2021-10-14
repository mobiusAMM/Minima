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
    }
}