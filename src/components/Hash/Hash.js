/* @flow */
import React, { PureComponent } from "react";
import "./Hash.css";

type Props = {
  hash: string
};

export default class ProgressBar extends PureComponent<Props> {
  render() {
    const { hash } = this.props;
    const parts = hash.split("");

    const init = parts.slice(0, 8).join("");
    const end = parts.slice(-3).join("");

    return (
      <span className="Hash" title={hash}>
        {init}..{end}
      </span>
    );
  }
}
