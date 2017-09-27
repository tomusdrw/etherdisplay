/* @flow */
import BigNumber from "bignumber.js";
import { chunk } from "lodash";

// toHex converts number to hex string representation prefixed with 0x.
export function toHex(n: number): string {
  return "0x" + n.toString(16);
}

// formatWithComma formats n with comma seprated digits.
export function formatWithComma(n: number): string {
  return new BigNumber(n).toFormat(0);
}

export function hexToBigNum(hex: string): BigNumber {
  if (hex.startsWith("0x")) {
    return hexToBigNum(
      hex
        .split("")
        .slice(2)
        .join("")
    );
  }

  return new BigNumber(hex, 16);
}

export function toAscii(hex: string) {
  if (hex.startsWith("0x")) {
    return toAscii(
      hex
        .split("")
        .slice(2)
        .join("")
    );
  }

  return chunk(hex.split(""), 2)
    .reverse()
    .map(hex => String.fromCharCode(parseInt(hex.join(""), 16)))
    .reverse()
    .reduce((acc, x) => acc + x, "");
}
