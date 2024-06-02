// SPDX-License-Identifier: ISC

pragma solidity ^0.8.0;

import "./AMMs/IWrapper.sol";
import "./Minima.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MobiusBaseBurner is Ownable {
  using SafeERC20 for IERC20;

  IERC20 baseToken;
  IERC20 constant MOBI = IERC20(0x73a210637f6F6B7005512677Ba6B3C96bb4AA44B);
  uint256 constant MAX_UINT = 2**256 - 1;

  IWrapper public MobiusWrapper;
  Minima public MinimaRouter;
  mapping(address => mapping(address => bool)) isApproved;

  address public emergencyOwner;
  address public receiver;
  address public recoveryReceiver;
  bool public is_killed;

  constructor(
    address _emergencyOwner,
    address _receiver,
    address _recoveryReceiver,
    IWrapper _mobiusWrapper,
    Minima _router,
    IERC20 _baseToken
  ) Ownable() {
    emergencyOwner = _emergencyOwner;
    receiver = _receiver;
    recoveryReceiver = _recoveryReceiver;
    MobiusWrapper = _mobiusWrapper;
    MinimaRouter = _router;
    baseToken = _baseToken;

    // Set max approval to the Minima Router for baseToken
    baseToken.safeApprove(address(_router), MAX_UINT);
  }

  modifier isLive() {
    require(!is_killed, "Burner is paused");
    _;
  }

  modifier ownerOrEmergency() {
    require(
      msg.sender == owner() || msg.sender == emergencyOwner,
      "Only owner"
    );
    _;
  }

  function burn(IERC20 coin) external isLive returns (bool) {
    uint256 amount = coin.balanceOf(msg.sender);
    uint256 amountBase;
    if (amount == 0) return false;

    coin.safeTransferFrom(msg.sender, address(this), amount);

    // If the token is not baseToken, then first swap into baseToken through the Mobius pools
    if (address(coin) != address(baseToken)) {
      if (!isApproved[address(coin)][address(MobiusWrapper)]) {
        coin.safeApprove(address(MobiusWrapper), MAX_UINT);
        isApproved[address(coin)][address(MobiusWrapper)] = true;
      }
      MobiusWrapper.swap(address(coin), address(baseToken), amount, 0);
    }

    MinimaRouter.swapOnChain(
      address(baseToken),
      address(MOBI),
      baseToken.balanceOf(address(this)),
      0,
      address(this)
    );

    MOBI.safeTransfer(receiver, MOBI.balanceOf(address(this)));
    return true;
  }

  function setMobiusWrapper(address wrapper) external ownerOrEmergency {
    MobiusWrapper = IWrapper(wrapper);
  }

  function setMinima(address minimaAddress) external ownerOrEmergency {
    MinimaRouter = Minima(minimaAddress);
    baseToken.approve(minimaAddress, MAX_UINT);
  }

  function recover_balance(IERC20 coin)
    external
    ownerOrEmergency
    returns (bool)
  {
    coin.transfer(recoveryReceiver, coin.balanceOf(address(this)));
    return true;
  }

  function setRecovery(address newRecovery) external onlyOwner {
    recoveryReceiver = newRecovery;
  }

  function setReciever(address newReciever) external onlyOwner {
    receiver = newReciever;
  }

  function setKilled(bool isKilled) external ownerOrEmergency {
    is_killed = true;
  }

  function setEmergencyOwner(address newEmergencyOwner)
    external
    ownerOrEmergency
  {
    emergencyOwner = newEmergencyOwner;
  }
}
