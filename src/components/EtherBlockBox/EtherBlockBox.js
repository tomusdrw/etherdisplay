/* @flow */
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import BigNumber from "bignumber.js";

import Hash from "../Hash";
import { timeSince } from "../../utils/date";
import { formatWithComma, hexToBigNum, toAscii } from "../../utils/number";
import "./EtherBlockBox.css";

type Props = {
  hash: string,
  parentHash: string,
  timestamp: Date,
  author: string,
  extraData: string,
  size: string,
  gasLimit: BigNumber,
  gasUsed: BigNumber,
  difficulty: BigNumber,
  totalDifficulty: BigNumber,
  number: BigNumber,
  transactions: any,
  etherPrice: number,
  hideNext: boolean
};

export default class EtherBlockBox extends PureComponent<Props> {
  state = {
    tab: "details"
  };

  render() {
    const { number } = this.props;
    const { tab } = this.state;

    return (
      <div className="EtherBlockBox">
        <div className="EtherBlockBox-topbar">
          <button className="EtherBlockBox-button-export">JSON</button>
          {this.renderPrevButton()}
          <h2> Block #{formatWithComma(number)} </h2>
          {this.renderNextButton()}
          <Link to="/">
            <button className="EtherBlockBox-button-close">×</button>
          </Link>
        </div>
        {this.renderMenu()}
        <div className="EtherBlockBox-content">
          {tab === "details" ? this.renderDetails() : null}
          {tab === "transactions" ? this.renderTransactions() : null}
        </div>
      </div>
    );
  }

  renderMenu() {
    const { transactions } = this.props;
    const { tab } = this.state;

    return (
      <div className="EtherBlockBox-buttons">
        <button
          className={tab === "details" ? "active" : ""}
          onClick={() => this.setState({ tab: "details" })}
        >
          DETAILS
        </button>
        <button
          className={tab === "transactions" ? "active" : ""}
          onClick={() => this.setState({ tab: "transactions" })}
        >
          TRANSACTIONS ({transactions.length})
        </button>
      </div>
    );
  }

  renderDetails() {
    const {
      parentHash,
      hash,
      timestamp,
      author,
      extraData,
      size,
      difficulty,
      totalDifficulty
    } = this.props;
    return (
      <table className="EtherBlockBox-details">
        <tbody>
          <Item label="Parent Hash">{parentHash}</Item>
          <Item label="Hash">{hash}</Item>
          <Item label="Timestamp">
            {timestamp.toString()} ({timeSince(timestamp)})
          </Item>
          <Item label="Author">
            <Link to={`/account/${author}`}>{author}</Link>
          </Item>
          <Item label="Extra Data">
            {toAscii(extraData)} ({extraData})
          </Item>
          <Item label="Size">{hexToBigNum(size).toFormat(0)} bytes</Item>
          <Item label="Gas Used">{this.renderGasUsed()}</Item>
          <Item label="Difficulty">{difficulty.toFormat(0)}</Item>
          <Item label="Total Difficulty">{totalDifficulty.toFormat(0)}</Item>
        </tbody>
      </table>
    );
  }

  renderGasUsed() {
    const { gasLimit, gasUsed } = this.props;
    const gasPercentage = gasUsed.mul(100).dividedBy(gasLimit);

    return (
      <span>
        {gasUsed.toFormat(0)} / {gasLimit.toFormat(0)} ({gasPercentage.toFormat(2)}%)
      </span>
    );
  }

  renderPrevButton() {
    const { number } = this.props;
    if (number.eq(0)) {
      return null;
    }

    return (
      <Link to={`/block/${number.minus(1)}`}>
        <button className="EtherBlockBox-button-arrow">
          <i className="EtherBlockBox-arrow-prev" />
        </button>
      </Link>
    );
  }
  renderNextButton() {
    const { number, hideNext } = this.props;
    if (hideNext) {
      return null;
    }

    return (
      <Link to={`/block/${number.plus(1)}`}>
        <button className="EtherBlockBox-button-arrow">
          <i className="EtherBlockBox-arrow-next" />
        </button>
      </Link>
    );
  }

  renderTransactions() {
    const { transactions, etherPrice } = this.props;
    if (!transactions.length) {
      return <div>There are no transactions in this block.</div>;
    }

    return (
      <table className="Transactions-table">
        <thead>
          <tr>
            <td />
            <td>hash</td>
            <td>from</td>
            <td>value</td>
            <td>to</td>
            <td>gas</td>
            <td>gas price (fee)</td>
            <td>data</td>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, id) => (
            <Transaction
              key={tx.hash}
              transaction={tx}
              etherPrice={etherPrice}
              idx={id}
            />
          ))}
        </tbody>
      </table>
    );
  }
}

function Item({ label, children }) {
  return (
    <tr className="Item">
      <td className="Item-label">{label}: </td>
      <td className="Item-content">{children}</td>
    </tr>
  );
}

function Transaction({ transaction: tx, etherPrice, idx }) {
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
        →
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
        ↦{" "}
        {tx.to ? (
          <Link to={`/account/${tx.to}`}>
            <Hash hash={tx.to} />
          </Link>
        ) : (
          <Link to={`/account/${tx.to}`}>(New Contract)</Link>
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
