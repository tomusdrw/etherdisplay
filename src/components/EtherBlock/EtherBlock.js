/* @flow */
import React, { PureComponent } from "react";
import ProgressBar from "../ProgressBar";
import Hash from "../Hash";
import "./EtherBlock.css";
import { formatWithComma, toHex } from "../../utils/number";
import { timeSince } from "../../utils/date";

type Props = {
  id: number,
  author: number,
  chain: number,
  created: Date,
  gas: number,
  gasMax: number,
  transactionNo: number,
  pending: boolean
};

export default class EtherBlock extends PureComponent<Props> {
  render() {
    const {
      id,
      author,
      chain,
      created,
      gas,
      gasMax,
      transactionNo,
      pending
    } = this.props;

    const gasPercentage = gas * 100 / gasMax;
    const strGasPercentage = gasPercentage.toFixed(2);
    const progressValue = gasPercentage / 100;
    const pendingText = pending ? <p className="transaction">pending</p> : null;
    const ago = timeSince(created);
    const blockId = formatWithComma(id);
    const hexChain = chain;
    const hexAuthor = author;

    const main = pending ? (
      <p>pending</p>
    ) : (
      <div>
        <p>
          {" "}
          <Hash hash={hexChain} />{" "}
        </p>
        <p> {ago} </p>
        <p>
          {" "}
          Author: <Hash hash={hexAuthor} />{" "}
        </p>
        <p>
          Gas: {formatWithComma(gas)} / {formatWithComma(gasMax)} ({strGasPercentage}%)
        </p>
        <ProgressBar value={progressValue} />
      </div>
    );

    return (
      <article className="EtherBlock">
        <header>
          <h1>Block #{blockId}</h1>
        </header>
        <section>{main}</section>
        <footer>
          <p className="transaction">{transactionNo} transactions</p>
          {pendingText}
        </footer>
      </article>
    );
  }
}
