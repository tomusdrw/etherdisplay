/* @flow */
import React from "react";
import { Link } from "react-router-dom";
import BigNumber from "bignumber.js";

import Hash from "../Hash";
import { hexToBigNum } from "../../utils/number";

import "./Transaction.css";

export default function Transaction({
  transaction: tx,
  etherPrice,
  idx,
  highlight
}) {
  const value = hexToBigNum(tx.value);
  const gas = hexToBigNum(tx.gas);
  const gasPrice = hexToBigNum(tx.gasPrice);
  const gwei = new BigNumber("1e9");
  const ether = new BigNumber("1e18");

  return (
    <tr className="Transactions-row">
      <td>{idx}.</td>
      <td>
        <Link to={`/transaction/${tx.hash}`}>
          <Hash hash={tx.hash} short />
        </Link>
      </td>
      <td>
        <Link to={`/account/${tx.from}`}>
          <Hash hash={tx.from} />
        </Link>{" "}
        {highlight && tx.from === highlight ? (
          <span className="Transactions-out">out</span>
        ) : (
          "→"
        )}
      </td>
      <td title={tx.value} className="Transactions-value">
        <div>{value.dividedBy(ether).toFormat(5)}Ξ</div>
        <small>
          ${value
            .mul(etherPrice)
            .dividedBy(ether)
            .toFormat(5)}
        </small>
      </td>
      <td>
        {highlight && tx.to === highlight ? (
          <span className="Transactions-in">in</span>
        ) : (
          "↦"
        )}{" "}
        {tx.to ? (
          <Link to={`/account/${tx.to}`}>
            <Hash hash={tx.to} />
          </Link>
        ) : (
          <Link to={`/account/${tx.creates}`}>(New Contract)</Link>
        )}
      </td>
      <td>{gas.dividedBy(1e4).toFormat(2)} kgas</td>
      <td>
        {gasPrice.dividedBy(gwei).toFormat(2)} Gwei (${gasPrice
          .mul(etherPrice)
          .mul(gas)
          .dividedBy(ether)
          .toFormat(5)})
      </td>
      <td className="Transactions-code">
        <code>{tx.input}</code>
      </td>
    </tr>
  );
}
