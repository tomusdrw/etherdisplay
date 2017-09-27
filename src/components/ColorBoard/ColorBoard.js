/* @flow */
import React, { PureComponent } from "react";
import "./ColorBoard.css";

export const order = {
  TopToBottom: "top-to-bottom",
  LeftToRight: "left-to-right"
};

type Order = $Keys<typeof order>;

type Color = {
  color: string,
  number: number
};

type Props = {
  row: number,
  column: number,
  order: Order,
  colors: Color[]
};

export default class ColorBoard extends PureComponent<Props> {
  static defaultProps = {
    row: 16,
    column: 4,
    order: order.TopToBottom,
    colors: []
  };

  render() {
    const { row, column, order, colors } = this.props;

    let tbody = [];
    for (let i = 0; i < row; i++) {
      let cells = [];
      for (let j = 0; j < column; j++) {
        cells.push(<td key={j} />);
      }
      tbody.push(<tr key={i}>{cells}</tr>);
    }

    switch (order) {
      case order.TopToBottom:
        for (let color of colors) {
          // color the td
          console.log(color);
        }
        break;
      case order.LeftToRight:
        for (let color of colors) {
          // color the td
          console.log(color);
        }
        break;
      default:
    }

    return (
      <table className="ColorBoard-table">
        <tbody>{tbody}</tbody>
      </table>
    );
  }
}
