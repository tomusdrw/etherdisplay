/* @flow */
import React, { PureComponent } from "react";
import ProgressBar from "../ProgressBar";
import "./EtherBlock.css";

type Props = {
  id: number,
  author: string,
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

    let gasPercentage = gas * 100 / gasMax;
    let pendingText = pending ? <p className="transaction">pending</p> : null;
    let main = pending ? (
      <span>pending</span>
    ) : (
      <div>
        <span> {chain} </span>
        <span> {created} </span>
        <span> Author: {author} </span>
        <span>
          {" "}
          Gas: {gas} / {gasMax} ({gasPercentage}%){" "}
        </span>
        <ProgressBar value={gasPercentage / 100} />
      </div>
    );

    return (
      <div className="EtherBlock-container">
        <span> Block #{id} </span>
        {main}
        <span>
          <p className="transaction">{transactionNo} transactions</p>
          {pendingText}
        </span>
      </div>
    );
  }
}
