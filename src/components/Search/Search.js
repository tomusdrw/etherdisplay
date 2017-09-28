/* @flow */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "./Search.css";

type Props = {};
type State = {};

export default withRouter(
  class Search extends Component<Props, State> {
    state = {
      value: ""
    };

    handleChange = ev => {
      const { value } = ev.target;
      const isPasted = value.length - this.state.value > 4;
      this.setState({ value });

      if (isPasted) {
        this.go(value);
      }
    };

    handleKey = ev => {
      if (ev.which === 13) {
        this.go();
      }
    };

    go(value = this.state.value) {
      const { history } = this.props;

      value = value.replace(/^\s+/g).replace(/\s+$/, "");

      if (value.startsWith("0x")) {
        value = value.substr(2);
      }

      if (value.length === 40) {
        history.push(`/account/0x${value}`);
        return;
      }

      if (value.length === 64) {
        history.push(`/transaction/0x${value}`);
        return;
      }

      history.push(`/block/${value}`);
    }

    render() {
      const { value } = this.state;
      return (
        <div className="Search">
          <input
            type="text"
            placeholder="Address / TxHash / BlockHash / BlockNumber"
            value={value}
            onChange={this.handleChange}
            onKeyPress={this.handleKey}
          />
        </div>
      );
    }
  }
);
