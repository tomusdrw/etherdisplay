/* @flow */
import React, { PureComponent } from "react";
import type { ChildrenArray, Element } from "react";
import EtherBlock from "../EtherBlock";
import "./EtherBlockPanel.css";

type Props = {
  children: $ReadOnlyArray<ChildrenArray<Element<typeof EtherBlock>[]>>
};

export default class EtherBlockPanel extends PureComponent<Props> {
  render() {
    const { children: childrenProp } = this.props;

    let children = React.Children.map(childrenProp, (child, i) => {
      if (i === childrenProp.length - 1) {
        return <div className="EtherBlockPanel-panel">{child}</div>;
      }
      return (
        <div className="EtherBlockPanel-panel">
          {child}
          <hr />
        </div>
      );
    });

    return <div className="EtherBlockPanel">{children}</div>;
  }
}
