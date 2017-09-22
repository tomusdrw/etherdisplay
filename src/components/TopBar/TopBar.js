/* @flow */
import React, { PureComponent } from "react";
import "./TopBar.css";

export default class Header extends PureComponent<{}> {
  render() {
    return (
      <div className="TopBar">
        <div className="TopBar-left">
          <span>KOVAN</span>
          <span>#4,654,344 (25s)</span>
        </div>
        <div className="TopBar-right">
          <span>
            Processing 7 transactions per second with average gas price of 3
            Gwei ($0.002)
          </span>
          <span>$300 / ETH</span>
        </div>
      </div>
    );
  }
}
