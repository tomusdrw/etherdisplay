/* @flow */
import React, { PureComponent } from "react";
import ProgressBar from "../ProgressBar";
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
    const progressValue =  gasPercentage / 100;
    const pendingText = pending ? <p className="transaction">pending</p> : null;
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
      <div className="EtherBlock">
        <p> Block #{blockId} </p>
        {main}
        <span>
          <p className="transaction">{transactionNo} transactions</p>
          {pendingText}
        </span>
      </div>
    );
  }
}
