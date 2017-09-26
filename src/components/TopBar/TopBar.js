/* @flow */
import React, { PureComponent } from "react";
import BigNumber from "bignumber.js";

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
    }, 500);
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

    return (
      <div className="TopBar">
        <div className="TopBar-left">
          <span>{chain.toUpperCase()}</span>
          <span>
            #{formatWithComma(latestBlockNumber)} ({this.time()})
          </span>
        </div>
        <div className="TopBar-right">
          <span>
            Processing {averageTxs.toFixed(2)} transactions per block with
            average gas price of {averageGasPrice
              .dividedBy(gwei)
              .toFormat(2)}{" "}
            Gwei (${averageGasPrice
              .mul(etherPrice)
              .dividedBy(ether)
              .toFormat(5)})
          </span>
          <span>${etherPrice} / ETH</span>
        </div>
      </div>
    );
  }
}
