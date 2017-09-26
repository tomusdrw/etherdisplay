import { Api } from "@parity/parity.js";
import { range } from "lodash";

import React, { Component } from "react";
import TopBar from "./components/TopBar";
import ColorBoard from "./components/ColorBoard";
import EtherBlock from "./components/EtherBlock";
import EtherBlockBox from "./components/EtherBlockBox";
import EtherBlockPanel from "./components/EtherBlockPanel";

import { hexToBigNum } from "./utils/number";

import "./App.css";

class App extends Component {
  state = {
    // TODO [ToDr] Replace with router
    view: "list",
    selectedBlock: null,

    latestBlockNumber: 0,
    blocks: [],
    pending: null,
    chain: "kovan",
    averageTxs: 0,
    averageGasPrice: hexToBigNum("0x0"),
    // TODO Fetch
    etherPrice: 300
  };

  componentDidMount() {
    const transport = new Api.Transport.Ws("ws://localhost:8546");
    const api = new Api(transport);
    this.api = window.api = api;

    api.pubsub.eth.blockNumber((err, number) => {
      this.refreshBlocks(number);
    });
    api.parity.chain().then(chain => {
      this.setState({ chain });
    });
  }

  refreshBlocks(number) {
    const min = Math.max(0, number - 10);
    Promise.all(
      range(min, number)
        .concat("pending")
        .map(number => this.api.eth.getBlockByNumber(number, true))
    ).then(blocks => {
      const pending = blocks.pop();
      this.setState({
        latestBlockNumber: number,
        blocks,
        pending,
        ...this.getStats(blocks)
      });
    });
  }

  getStats(blocks) {
    const transactions = blocks.reduce(
      (acc, block) => acc.concat(block.transactions),
      []
    );
    const totalGasPrice = transactions.reduce(
      (acc, tx) => hexToBigNum(tx.gasPrice).add(acc),
      0
    );

    const averageTxs = transactions.length / blocks.length;
    const averageGasPrice = totalGasPrice.dividedBy(transactions.length);

    return { averageTxs, averageGasPrice };
  }

  latestBlockTime() {
    const { blocks } = this.state;
    if (!blocks.length) {
      return new Date(0);
    }

    return new Date(blocks[blocks.length - 1].timestamp);
  }

  render() {
    const {
      chain,
      latestBlockNumber,
      averageTxs,
      averageGasPrice,
      etherPrice,
      view
    } = this.state;
    const latestBlockTime = this.latestBlockTime();

    return (
      <div className="App">
        <TopBar
          {...{
            chain,
            latestBlockNumber,
            latestBlockTime,
            averageTxs,
            averageGasPrice,
            etherPrice
          }}
        />
        {view === "list" ? this.renderBlocks() : null}
        {view === "details" ? this.renderDetails() : null}
      </div>
    );
  }

  renderDetails() {
    const { selectedBlock, blocks, pending } = this.state;
    let block = blocks.find(block => block.number.eq(selectedBlock));

    if (!block) {
      block = pending;
    }

    return (
      <EtherBlockBox
        {...block}
        hideNext={block === pending}
        onClose={() => {
          this.setState({ view: "list" });
        }}
        onChangeBlock={selectedBlock => {
          this.setState({ selectedBlock });
        }}
      />
    );
  }

  renderBlocks() {
    const { blocks, pending } = this.state;
    return (
      <EtherBlockPanel>
        {blocks
          .map(block => [block, false])
          .concat([[pending, true]])
          .map(([block, pending]) => this.renderBlock(block, pending))}
      </EtherBlockPanel>
    );
  }

  renderBlock(block, pending = false) {
    if (!block) {
      return null;
    }

    const {
      author,
      hash,
      gasUsed,
      gasLimit,
      number,
      timestamp,
      transactions
    } = block;
    return (
      <EtherBlock
        key={hash}
        id={number}
        author={author}
        chain={hash}
        created={timestamp}
        gas={gasUsed.toNumber()}
        gasMax={gasLimit.toNumber()}
        transactionNo={transactions.length}
        pending={pending}
        onDetails={() => {
          this.setState({
            view: "details",
            selectedBlock: number
          });
        }}
      />
    );
  }
}

export default App;
