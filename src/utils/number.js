/* @flow */

// toHex converts number to hex string representation prefixed with 0x.
export function toHex(n: number): string {
  return "0x" + n.toString(16);
}

// formatWithComma formats n with comma seprated digits.
export function formatWithComma(n: number): string {
  return n.toLocaleString("en");
}
