/* @flow */
import React, { PureComponent } from "react";
import type { ChildrenArray, Element } from "react";
import EtherBlock from "../EtherBlock";
import "./EtherBlockPanel.css";

type Props = {
  children: ChildrenArray<Element<typeof EtherBlock>[]>
};

export default class EtherBlockPanel extends PureComponent<Props> {
  render() {
    const { children } = this.props;

    let newChildren = React.Children.map(children, (child, i) => {
      if (i === children.length - 1) {
        return <div className="EtherBlockPanel-panel">{child}</div>;
      }
      return (
        <div className="EtherBlockPanel-panel">
          {child}
          <hr />
        </div>
      );
    });

    return <div className="EtherBlockPanel-container">{newChildren}</div>;
  }
}
