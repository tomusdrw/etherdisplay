/* @flow */
import React, { PureComponent } from "react";
import BigNumber from "bignumber.js";
import { Link } from "react-router-dom";

import { timeSince } from "../../utils/date";
import { formatWithComma } from "../../utils/number";

import "./TopBar.css";

type Props = {
  chain: string,
  latestBlockNumber: number,
  latestBlockTime: ?Date,
  averageTxs: number,
  averageGasPrice: BigNumber
};

export default class Header extends PureComponent<Props> {
  state = {
    currentTime: new Date()
  };

  componentDidMount() {
    this.interval = window.setInterval(() => {
      const currentTime = new Date();
      this.setState({ currentTime });
    }, 750);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  time() {
    return timeSince(this.props.latestBlockTime, this.state.currentTime);
  }

  render() {
    const { chain, latestBlockNumber } = this.props;
    const { averageTxs, averageGasPrice, etherPrice } = this.props;
    const gwei = new BigNumber("1e9");
    const ether = new BigNumber("1e18");
    const transfer = new BigNumber(21000);

    return (
      <div className="TopBar">
        <div className="TopBar-left">
          <span>
            <Link to="/">{chain.toUpperCase()}</Link>
          </span>
          <span>
            <Link to={`/block/${latestBlockNumber}`}>
              #{formatWithComma(latestBlockNumber)}
            </Link>{" "}
            ({this.time()})
          </span>
        </div>
        <div className="TopBar-right">
          <span>
            {averageTxs.toFixed(2)} txs per block with avg gas price of{" "}
            {averageGasPrice.dividedBy(gwei).toFormat(2)} Gwei (${averageGasPrice
              .mul(etherPrice)
              .mul(transfer)
              .dividedBy(ether)
              .toFormat(5)}/tx)
          </span>
          <span>${etherPrice} = 1Ξ</span>
        </div>
      </div>
    );
  }
}
