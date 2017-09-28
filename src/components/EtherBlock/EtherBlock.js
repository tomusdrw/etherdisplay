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
  author: string,
  hash: string,
  parentHash: string,
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
      hash,
      parentHash,
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
    const pendingText = pending ? "pending" : null;

    // TODO: move to willReaciveProps
    const ago = timeSince(created);
    const blockId = formatWithComma(id);

    const main = pending ? (
      <div>
        <p>
          <strong>Pending Block</strong>
        </p>
        <p>
          Hash: <Hash hash={hash} />{" "}
        </p>
        <p>
          Parent: <Hash hash={parentHash} />{" "}
        </p>
      </div>
    ) : (
      <div>
        <p>
          Hash: <Hash hash={hash} />{" "}
        </p>
        <p>
          Parent: <Hash hash={parentHash} />{" "}
        </p>
        <p title={created}> {ago} </p>
        <p>
          Author:{" "}
          <Link to={`/account/${author}`}>
            <Hash hash={author} />
          </Link>
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
          <h2>
            <Link to={`/block/${id}`}>Block #{blockId}</Link>
          </h2>
        </header>
        <section>{main}</section>
        <footer>
          <Link to={`/block/${id}`}>
            <p className="transaction">
              {transactionNo} transactions {pendingText}
            </p>
          </Link>
        </footer>
      </article>
    );
  }
}
