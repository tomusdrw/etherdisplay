/* @flow */
import React, { PureComponent } from "react";
import "./ProgressBar.css";

type Props = {
  value: number
};

export default class ProgressBar extends PureComponent<Props> {
  static defaultProps = {
    value: 0
  };

  render() {
    const { value } = this.props;

    return <progress className="ProgressBar" value={value} />;
  }
}
