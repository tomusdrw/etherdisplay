import React, { Component } from "react";
import blockies from "blockies";

import "./Identicon.css";

export default class Identicon extends Component {
  static defaultProps = {
    scale: 8
  };

  state: {
    img: ""
  };

  componentWillMount() {
    this.updateImage(this.props);
  }

  componentWillReceiveProps({ seed, scale }) {
    if (seed !== this.props.seed || scale !== this.props.scale) {
      this.updateImage({ seed, scale });
    }
  }

  updateImage({ seed, scale }) {
    const img = blockies({
      seed: (seed || "").toLowerCase(),
      size: 8,
      scale
    }).toDataURL();

    this.setState({ img });
  }

  render() {
    const { seed } = this.props;
    const { img } = this.state;

    return <img className="Identicon" src={`${img}`} alt={seed} />;
  }
}
