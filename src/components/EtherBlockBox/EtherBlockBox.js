/* @flow */
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../ProgressBar";
import { formatWithComma, toHex } from "../../utils/number";
import { timeSince } from "../../utils/date";
import "./EtherBlockBox.css";

type Props = {
  id: number
};

export default class EtherBlockBox extends PureComponent<Props> {
  render() {
    const { id } = this.props;

    const blockId = formatWithComma(id);

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
          <h2> Block #{blockId} </h2>
          <button className="EtherBlockBox-button-arrow">
            <i className="EtherBlockBox-arrow-next" />
          </button>
          <Link to="/">
            <button className="EtherBlockBox-button-close">×</button>
          </Link>
        </div>
      </div>
    );
  }
}
