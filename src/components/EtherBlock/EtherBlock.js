/* @flow */
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import ProgressBar from "../ProgressBar";
import Hash from "../Hash";

import { formatWithComma } from "../../utils/number";
import { timeSince } from "../../utils/date";
import "./EtherBlock.css";

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
      author,
      chain,
      created,
      gas,
      gasMax,
      id,
      pending,
      transactionNo
    } = this.props;

    const gasPercentage = gas * 100 / gasMax;
    const strGasPercentage = gasPercentage.toFixed(2);
    const progressValue = gasPercentage / 100;
    const pendingText = pending ? <p className="transaction">pending</p> : null;

    // TODO: move to willReaciveProps
    const ago = timeSince(created);
    const blockId = formatWithComma(id);

    const main = pending ? (
      <p>pending</p>
    ) : (
      <div>
        <p>
          {" "}
          <Hash hash={chain} />{" "}
        </p>
        <p> {ago} </p>
        <p>
          {" "}
          Author: <Hash hash={author} />{" "}
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
          <h1>
            <Link to={`/block/${id}`}>Block #{blockId}</Link>
          </h1>
        </header>
        <section>{main}</section>
        <footer>
          <Link to={`/block/${id}/transactions`}>
            <p className="transaction">{transactionNo} transactions</p>
          </Link>
          {pendingText}
        </footer>
      </article>
    );
  }
}
