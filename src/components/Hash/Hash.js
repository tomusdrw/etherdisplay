/* @flow */
import React, { PureComponent } from "react";
import "./Hash.css";

type Props = {
  hash: string,
  short: ?boolean
};

export default class ProgressBar extends PureComponent<Props> {
  static defaultProps = {
    short: false
  };

  render() {
    const { hash, short } = this.props;

    if (!hash) {
      return <span className="Hash">{hash}</span>;
    }

    const parts = hash.split("");

    const init = parts.slice(0, short ? 4 : 8).join("");
    const end = parts.slice(short ? -2 : -3).join("");

    return (
      <span className="Hash" title={hash}>
        {init}..{end}
      </span>
    );
  }
}
