/* @flow */
import React, { Component } from "react";
import EtherBlock from "../EtherBlock";
import EtherBlockPanel from "../EtherBlockPanel";

type Props = {};
type State = {
  blocks: []
};

export default class EtherBlockPanelFetch extends Component<Props, State> {
  compoenentDidMount() {
    // fetch blocks
  }

  render() {
    return (
      <EtherBlockPanel>
        <EtherBlock
          id={5654343}
          author={0x1234567890}
          chain={0xdead000011112222cafe}
          created={new Date("2017-09-22T07:00:00.000Z")}
          gas={1300000}
          gasMax={14700000}
          transactionNo={3}
        />
        <EtherBlock
          id={4654}
          author={0x1234567890}
          chain={0xdead000011112222cafe}
          created={Date.now()}
          gas={1300000}
          gasMax={14700000}
          transactionNo={3}
          pending
        />
        <EtherBlock
          id={4654343}
          author={0x1234567890}
          chain={0xdead000011112222cafe}
          created={Date.now()}
          gas={1300000}
          gasMax={14700000}
          transactionNo={3}
          pending
        />
        <EtherBlock
          id={4654343}
          author={0x1234567890}
          chain={0xdead000011112222cafe}
          created={Date.now()}
          gas={1300000}
          gasMax={14700000}
          transactionNo={3}
          pending
        />
        <EtherBlock
          id={4654346}
          author={0x1234567890}
          chain={0xdead000011112222cafe}
          created={Date.now()}
          gas={1300000}
          gasMax={14700000}
          transactionNo={3}
          pending
        />
      </EtherBlockPanel>
    );
  }
}
