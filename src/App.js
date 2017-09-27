/* @flow */
import { Api } from "@parity/parity.js";
import { range } from "lodash";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import TopBar from "./components/TopBar";
import EtherBlock from "./components/EtherBlock";
import EtherBlockBox from "./components/EtherBlockBox";
import EtherBlockPanel from "./components/EtherBlockPanel";

import { hexToBigNum } from "./utils/number";

import "./App.css";

class App extends Component {
  state = {
    latestBlockNumber: 0,
    blocks: [],
    fetchedBlocks: {},
    fetchInProgress: false,
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
    this.fetchBlocks(
      range(min, number).concat("pending"),
      true
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

  fetchBlocks(range, force = false) {
    if (!this.api) {
      return;
    }

    const { fetchedBlocks, fetchInProgress } = this.state;
    const blocks = range
      .filter(number => force || !fetchedBlocks[number])
      .map(number => this.api.eth.getBlockByNumber(number, true));

    if (!blocks.length) {
      return;
    }

    if (!fetchInProgress) {
      setTimeout(() => {
        this.setState({ fetchInProgress: true });
      });
    }
    return Promise.all(blocks).then(blocks => {
      this.updateFetchedBlocks(blocks);
      return blocks;
    });
  }

  updateFetchedBlocks(blocks) {
    const { fetchedBlocks } = this.state;
    blocks.forEach(block => {
      fetchedBlocks[block.number] = block;
    });
    // TODO [ToDr] Clear old blocks after some time to prevent mem leaks.
    this.setState({
      fetchInProgress: false,
      fetchedBlocks: {
        ...fetchedBlocks
      }
    });
  }

  getStats(blocks) {
    const transactions = blocks.reduce(
      (acc, block) => acc.concat(block.transactions),
      []
    );
    const totalGasPrice = transactions.reduce(
      (acc, tx) => hexToBigNum(tx.gasPrice).add(acc),
      hexToBigNum("0x0")
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
      etherPrice
    } = this.state;
    const latestBlockTime = this.latestBlockTime();

    return (
      <Router>
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
          <Switch>
            <Route exact path="/" render={() => this.renderBlocks()} />
            <Route
              path="/block/:id"
              render={({ match }) => this.renderDetails(match.params.id)}
            />
          </Switch>
        </div>
      </Router>
    );
  }

  renderDetails(selectedBlock) {
    this.fetchBlocks([selectedBlock]);
    const { fetchedBlocks, pending, etherPrice, fetchInProgress } = this.state;

    let block = fetchedBlocks[selectedBlock];

    if (!block && !fetchInProgress) {
      block = pending;
    }

    if (!block) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    }

    return (
      <div className="App-content">
        <EtherBlockBox
          {...block}
          hideNext={block === pending}
          etherPrice={etherPrice}
        />
      </div>
    );
  }

  renderBlocks() {
    const { blocks, pending } = this.state;
    return (
      <div className="App-content">
        <EtherBlockPanel>
          {blocks
            .slice(-4)
            .map(block => [block, false])
            .concat([[pending, true]])
            .reverse()
            .map(([block, pending]) => this.renderBlock(block, pending))}
        </EtherBlockPanel>
      </div>
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
      />
    );
  }
}

export default App;
