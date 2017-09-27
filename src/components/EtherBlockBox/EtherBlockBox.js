/* @flow */
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import { formatWithComma, hexToBigNum } from "../../utils/number";
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
        {tab === "details" ? this.renderDetails() : null}
        {tab === "transactions" ? this.renderTransactions() : null}
      </div>
    );
  }

  renderMenu() {
    const { transactions } = this.props;
    return (
      <div className="Menu">
        <button onClick={() => this.setState({ tab: "details" })}>
          DETAILS
        </button>
        <button onClick={() => this.setState({ tab: "transactions" })}>
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
      <div>
        <Item label="Parent Hash">{parentHash}</Item>
        <Item label="Hash">{hash}</Item>
        <Item label="Timestamp">{timestamp.toString()}</Item>
        <Item label="Author">{author}</Item>
        <Item label="Extra Data">{extraData}</Item>
        <Item label="Size">{hexToBigNum(size).toFormat(0)} bytes</Item>
        <Item label="Gas Used">{this.renderGasUsed()}</Item>
        <Item label="Difficulty">{difficulty.toFormat(0)}</Item>
        <Item label="Total Difficulty">{totalDifficulty.toFormat(0)}</Item>
      </div>
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

  renderTransactions() {
    const { transactions } = this.props;
    if (!transactions.length) {
      return <div>There are no transactions in this block.</div>;
    }

    return (
      <div style={{ textAlign: "left " }}>
        {transactions.map((tx, id) => (
          <div key={tx.hash}>
            <div>#{id + 1}</div>
            <pre>{JSON.stringify(tx, null, 2)}</pre>
          </div>
        ))}
      </div>
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
}

function Item({ label, children }) {
  return (
    <div className="Item">
      <div className="Item-label">{label}: </div>
      <div className="Item-content">{children}</div>
    </div>
  );
}
