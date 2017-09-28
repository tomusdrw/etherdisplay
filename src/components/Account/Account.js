/* @flow */
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import BigNumber from "bignumber.js";
import { groupBy } from "lodash";

import Hash from "../Hash";
import Identicon from "../Identicon";
import Transaction from "../Transaction";
import { hexToBigNum } from "../../utils/number";

import "./Account.css";

type Props = {
  address: string,
  balance: string,
  nonce: string,
  code: string,
  etherPrice: number
};

export default class Account extends PureComponent<Props> {
  render() {
    const { address, balance, nonce, etherPrice } = this.props;

    const ether = new BigNumber("1e18");

    return (
      <div className="Account">
        <h2>
          Account <Hash hash={address} />
        </h2>
        <div className="Account-header">
          <div className="Account-left">
            <Identicon seed={address} />
          </div>
          <div className="Account-right">
            <h3 title={balance}>
              <div>{balance.dividedBy(ether).toFormat(3)}Ξ</div>
              <small>
                ${balance
                  .mul(etherPrice)
                  .dividedBy(ether)
                  .toFormat(4)}
              </small>
            </h3>
            <p>{nonce.toFormat(0)} txs</p>
          </div>
        </div>
        {this.renderCode()}
        <div className="Account-transactions">{this.renderTransactions()}</div>
      </div>
    );
  }

  renderCode() {
    const { code } = this.props;

    if (code === "0x") {
      return null;
    }

    return (
      <div className="Account-code">
        <h4>Contract code:</h4>
        <textarea readOnly defaultValue={code} />
      </div>
    );
  }

  renderTransactions() {
    const { transactions, etherPrice, address } = this.props;
    if (!transactions.length) {
      return <h4>No transactions in last blocks.</h4>;
    }

    const byBlock = groupBy(transactions.reverse(), "blockNumber");

    return (
      <div>
        <h4>Transactions in last blocks ({transactions.length}):</h4>

        <table>
          {Object.keys(byBlock)
            .sort()
            .reverse()
            .map(block => {
              const transactions = byBlock[block];
              const blockNumber = hexToBigNum(transactions[0].blockNumber);
              return (
                <tbody key={block}>
                  <tr>
                    <td colSpan="8">
                      <h5>
                        <Link to={`/block/${blockNumber}`}>
                          #{blockNumber.toFormat(0)}
                        </Link>
                      </h5>
                    </td>
                  </tr>
                  {transactions.map((tx, idx) => (
                    <Transaction
                      key={tx.hash}
                      transaction={tx}
                      etherPrice={etherPrice}
                      highlight={address}
                      idx={idx + 1}
                    />
                  ))}
                </tbody>
              );
            })}
        </table>
      </div>
    );
  }
}
