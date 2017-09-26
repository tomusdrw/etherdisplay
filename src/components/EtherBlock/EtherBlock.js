/* @flow */
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../ProgressBar";
import { formatWithComma, toHex } from "../../utils/number";
import { timeSince } from "../../utils/date";
import "./EtherBlock.css";

type Props = {
  author: number,
  chain: number,
  created: Date,
  gas: number,
  gasMax: number,
  id: number,
  pending: boolean,
  transactionNo: number
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
    const hexChain = toHex(chain);
    const hexAuthor = toHex(author);

    const main = pending ? (
      <p>pending</p>
    ) : (
      <div>
        <p> {hexChain} </p>
        <p> {ago} </p>
        <p> Author: {hexAuthor} </p>
        <p>
          Gas: {gas} / {gasMax} ({strGasPercentage}%)
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
          <p className="transaction">{transactionNo} transactions</p>
          {pendingText}
        </footer>
      </article>
    );
  }
}
