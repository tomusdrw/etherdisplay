/* @flow */
import { Api } from "@parity/parity.js";
import { range } from "lodash";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import TopBar from "./components/TopBar";
import Search from "./components/Search";
import Account from "./components/Account";
import EtherBlock from "./components/EtherBlock";
import EtherBlockBox from "./components/EtherBlockBox";
import EtherBlockPanel from "./components/EtherBlockPanel";

import { hexToBigNum } from "./utils/number";

import "./App.css";

class App extends Component {
  state = {
    latestBlockNumber: 0,
    blocks: [],
    fetchedAccounts: {},
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
    const min = Math.max(0, number - 15);
    this.fetchBlocks(
      range(min, number).concat(["pending"]),
      true
    ).then(blocks => {
      const pending = blocks.pop();
      this.setState({
        latestBlockNumber: number,
        blocks,
        pending,
        ...this.getStats(blocks)
      });

      // update accounts
      const { fetchedAccounts } = this.state;

      Object.keys(fetchedAccounts).forEach(address => {
        fetchedAccounts[address].transactions = this.findTransactions(
          address,
          blocks,
          pending
        );
      });

      this.setState({
        fetchedAccounts: {
          ...fetchedAccounts
        }
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

  findTransactions(
    address,
    blocks = this.state.blocks,
    pending = this.state.pending
  ) {
    const allTransactions = blocks
      .concat([pending])
      .filter(x => x)
      .reduce((acc, block) => acc.concat(block.transactions), []);

    return allTransactions.filter(
      tx =>
        tx.from.toLowerCase() === address ||
        (tx.to ? tx.to.toLowerCase() === address : false)
    );
  }

  fetchAccount(address) {
    if (!this.api) {
      return;
    }

    const { fetchedAccounts, fetchInProgress } = this.state;

    if (fetchedAccounts[address]) {
      return;
    }

    if (!fetchInProgress) {
      setTimeout(() => {
        this.setState({ fetchInProgress: true });
      });
    }

    const accountData = [
      this.api.eth.getCode(address),
      this.api.eth.getBalance(address),
      this.api.eth.getTransactionCount(address)
    ];

    return Promise.all(accountData).then(data => {
      const [code, balance, nonce] = data;

      // Get transactions:
      const transactions = this.findTransactions(address);

      this.setState({
        fetchInProgress: false,
        fetchedAccounts: {
          ...fetchedAccounts,
          [address]: { address, code, balance, nonce, transactions }
        }
      });
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
              path="/block/:number"
              render={({ match }) => this.renderDetails(match.params.number)}
            />
            <Route
              path="/account/:address"
              render={({ match }) => this.renderAccount(match.params.address)}
            />
            <Route
              path="/transaction/:hash"
              render={({ match }) => this.renderTransaction(match.params.hash)}
            />
          </Switch>
          <Search />
        </div>
      </Router>
    );
  }

  renderTransaction(hash) {
    return (
      <div className="App-content">
        <p>{hash}</p>
      </div>
    );
  }

  renderAccount(address) {
    address = address.toLowerCase();
    this.fetchAccount(address);
    const { fetchedAccounts, fetchInProgress, etherPrice, blocks } = this.state;

    const account = fetchedAccounts[address];

    if (!account || !blocks.length) {
      return (
        <div>
          <h1>{fetchInProgress ? "Loading..." : "Not found"}</h1>
        </div>
      );
    }

    return (
      <div className="App-content">
        <Account {...account} etherPrice={etherPrice} />
      </div>
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
    const last = blocks[blocks.length - 1];
    return (
      <div className="App-content">
        <EtherBlockPanel>
          {blocks
            .slice(-4)
            .map(block => [block, false])
            .concat(last !== pending ? [[pending, true]] : [])
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
