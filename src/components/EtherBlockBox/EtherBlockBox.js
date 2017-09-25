/* @flow */
import React, { PureComponent } from "react";
import ProgressBar from "../ProgressBar";
import "./EtherBlockBox.css";
import { formatWithComma, toHex } from "../../utils/number";
import { timeSince } from "../../utils/date";

type Props = {};

export default class EtherBlockBox extends PureComponent<Props> {
  render() {
    return (
      <div className="EtherBlockBox">
        <div className="EtherBlockBox-topbar">
          <button className="EtherBlockBox-button-export">
            {" "}
            Export as json{" "}
          </button>
          <button className="EtherBlockBox-button-arrow">
            <i className="EtherBlockBox-arrow-prev" />
          </button>
          <h2> Block #4,654,343 </h2>
          <button className="EtherBlockBox-button-arrow">
            <i className="EtherBlockBox-arrow-next" />
          </button>
          <button className="EtherBlockBox-button-close">×</button>
        </div>
        <div>test</div>
      </div>
    );
  }
}
