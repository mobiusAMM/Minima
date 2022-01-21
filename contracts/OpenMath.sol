// SPDX-License-Identifier: ISC

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

library OpenMath {
  uint256 constant MAX_UINT = 2**256 - 1;
  uint256 constant DECIMALS_UINT = 10**18;
  int256 constant DECIMALS_SIGNED = 10**18;
  int256 constant MAX_INT = 2**255 - 1;
  uint256 internal constant HALF_SCALE = 5e17;

  /// @dev How many trailing decimals can be represented.
  int256 internal constant SCALE = 1e18;

  // 2^127.
  uint128 private constant TWO127 = 0x80000000000000000000000000000000;

  // 2^128 - 1
  uint128 private constant TWO128_1 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

  // ln(2) * 2^128
  uint128 private constant LN2 = 0xb17217f7d1cf79abc9e3b39803f2f6af;

  /**
   * Return index of most significant non-zero bit in given non-zero 256-bit
   * unsigned integer value.
   *
   * @param _x value to get index of most significant non-zero bit in
   * @return r index of most significant non-zero bit in given number
   */
  function mostSignificantBit(uint256 _x) internal pure returns (uint8 r) {
    require(_x > 0);

    uint256 x = _x;
    r = 0;
    if (x >= 0x100000000000000000000000000000000) {
      x >>= 128;
      r += 128;
    }
    if (x >= 0x10000000000000000) {
      x >>= 64;
      r += 64;
    }
    if (x >= 0x100000000) {
      x >>= 32;
      r += 32;
    }
    if (x >= 0x10000) {
      x >>= 16;
      r += 16;
    }
    if (x >= 0x100) {
      x >>= 8;
      r += 8;
    }
    if (x >= 0x10) {
      x >>= 4;
      r += 4;
    }
    if (x >= 0x4) {
      x >>= 2;
      r += 2;
    }
    if (x >= 0x2) r += 1; // No need to shift x anymore
  }

  /*
function mostSignificantBit (uint256 x) pure internal returns (uint8) {
  require (x > 0);

  uint8 l = 0;
  uint8 h = 255;

  while (h > l) {
    uint8 m = uint8 ((uint16 (l) + uint16 (h)) >> 1);
    uint256 t = x >> m;
    if (t == 0) h = m - 1;
    else if (t > 1) l = m + 1;
    else return m;
  }

  return h;
}
*/

  /**
   * Calculate log_2 (x / 2^128) * 2^128.
   *
   * @param _x parameter value
   * @return log_2 (x / 2^128) * 2^128
   */
  function log_2(uint256 _x) internal pure returns (int256) {
    require(_x > 0, "Must be a positive number");
    uint256 x = _x;
    uint8 msb = mostSignificantBit(x);
    if (msb > 128) x >>= msb - 128;
    else if (msb < 128) x <<= 128 - msb;

    x &= TWO128_1;

    int256 result = (int256(msb) - 128) << 128; // Integer part of log_2

    int256 bit = TWO127;
    for (uint8 i = 0; i < 128 && x > 0; i++) {
      x = (x << 1) + ((x * x + TWO127) >> 128);
      if (x > TWO128_1) {
        result |= bit;
        x = (x >> 1) - TWO127;
      }
      bit >>= 1;
    }

    return result;
  }

  // Returns exchange rate as a 59.18 decimal integer
  function exchangeRate(uint256 amountIn, uint256 amountOut)
    public
    pure
    returns (uint256 exchange)
  {
    exchange = (amountOut * DECIMALS_UINT) / amountIn;
  }
}
