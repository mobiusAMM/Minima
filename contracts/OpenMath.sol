//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

library OpenMath {
  uint256 MAX_UINT = 2**256 - 1;
  uint256 DECIMALS_UINT = 10 ** 18;
  int256 DECIMALS_SIGNED = 10 ** 18;
  int256 MAX_INT = 2**255 - 1;

  /// @notice Finds the zero-based index of the first one in the binary representation of x.
  /// @dev See the note on msb in the "Find First Set" Wikipedia article https://en.wikipedia.org/wiki/Find_first_set
  /// @param x The uint256 number for which to find the index of the most significant bit.
  /// @return msb The index of the most significant bit as an uint256.
  function mostSignificantBit(uint256 x) internal pure returns (uint256 msb) {
    if (x >= 2**128) {
      x >>= 128;
      msb += 128;
    }
    if (x >= 2**64) {
      x >>= 64;
      msb += 64;
    }
    if (x >= 2**32) {
      x >>= 32;
      msb += 32;
    }
    if (x >= 2**16) {
      x >>= 16;
      msb += 16;
    }
    if (x >= 2**8) {
      x >>= 8;
      msb += 8;
    }
    if (x >= 2**4) {
      x >>= 4;
      msb += 4;
    }
    if (x >= 2**2) {
      x >>= 2;
      msb += 2;
    }
    if (x >= 2**1) {
      // No need to shift x any more.
      msb += 1;
    }
  }

  /// @notice Calculates the binary logarithm of x.
  ///
  /// @dev Based on the iterative approximation algorithm.
  /// https://en.wikipedia.org/wiki/Binary_logarithm#Iterative_approximation
  ///
  /// Requirements:
  /// - x must be greater than zero.
  ///
  /// Caveats:
  /// - The results are nor perfectly accurate to the last digit, due to the lossy precision of the iterative approximation.
  ///
  /// @param x The signed 59.18-decimal fixed-point number for which to calculate the binary logarithm.
  /// @return result The binary logarithm as a signed 59.18-decimal fixed-point number.
  function log2(int256 x) internal pure returns (int256 result) {
    require(x > 0);
    unchecked {
      // This works because log2(x) = -log2(1/x).
      int256 sign;
      if (x >= SCALE) {
        sign = 1;
      } else {
        sign = -1;
        // Do the fixed-point inversion inline to save gas. The numerator is SCALE * SCALE.
        assembly {
          x := div(1000000000000000000000000000000000000, x)
        }
      }

      // Calculate the integer part of the logarithm and add it to the result and finally calculate y = x * 2^(-n).
      uint256 n = mostSignificantBit(uint256(x / SCALE));

      // The integer part of the logarithm as a signed 59.18-decimal fixed-point number. The operation can't overflow
      // because n is maximum 255, SCALE is 1e18 and sign is either 1 or -1.
      result = int256(n) * SCALE;

      // This is y = x * 2^(-n).
      int256 y = x >> n;

      // If y = 1, the fractional part is zero.
      if (y == SCALE) {
        return result * sign;
      }

      // Calculate the fractional part via the iterative approximation.
      // The "delta >>= 1" part is equivalent to "delta /= 2", but shifting bits is faster.
      for (int256 delta = int256(HALF_SCALE); delta > 0; delta >>= 1) {
        y = (y * y) / SCALE;

        // Is y^2 > 2 and so in the range [2,4)?
        if (y >= 2 * SCALE) {
          // Add the 2^(-m) factor to the logarithm.
          result += delta;

          // Corresponds to z/2 on Wikipedia.
          y >>= 1;
        }
      }
      result *= sign;
    }
  }

  function safeUnsignedToSigned(uint256 unsigned) public pure returns (int256) {
    require(unsigned & (1 << 256) == 0, "Unsigned integer is too large, conversion will result in a negative number");
    return int256(unsigned);
  }

  // Returns exchange rate as a 59.18 decimal integer
  function exchangeRate(uint256 amountIn, uint256 amountOut) public pure returns (int256 exchange) {
    int256 numerator = safeUnsignedToSigned(amountIn);
    int256 denominator = safeUnsignedToSigned(amountOut);

    exchange = (numerator * DECIMALS_SIGNED) / denominator
  }
}
