/* @flow */
import { Api } from "@parity/parity.js";
import { range } from "lodash";
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
import BigNumber from "bignumber.js";

import Hash from "./components/Hash";
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
    fetchedTransactions: {},
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

  fetchTransaction(hash) {
    if (!this.api) {
      return;
    }

    const { fetchedTransactions, fetchInProgress } = this.state;

    if (fetchedTransactions[hash]) {
      return;
    }

    if (!fetchInProgress) {
      setTimeout(() => {
        this.setState({ fetchInProgress: true });
      });
    }

    const data = [
      this.api.eth.getTransactionReceipt(hash),
      this.api.eth.getTransactionByHash(hash)
    ];
    return Promise.all(data).then(d => {
      const [receipt, tx] = d;

      this.setState({
        fetchInProgress: false,
        fetchedTransactions: {
          ...fetchedTransactions,
          [hash]: { receipt, tx }
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
            <Redirect from="*" to="/" />
          </Switch>
          <Search />
          <div>
            <pre style={{ background: "#eee" }}>
              $ git clone --depth=1 -b built
              https://github.com/tomusdrw/etherdisplay
            </pre>
            Get a local version of the dapp (for private chain).
            <p />
          </div>
        </div>
      </Router>
    );
  }

  renderTransaction(hash) {
    this.fetchTransaction(hash);

    const { fetchedTransactions, fetchInProgress, etherPrice } = this.state;

    const transaction = fetchedTransactions[hash];

    if (!transaction) {
      return (
        <div>
          <h1>{fetchInProgress ? "Loading..." : "Not found"}</h1>
        </div>
      );
    }

    const { receipt, tx } = transaction;

    const gwei = new BigNumber("1e9");
    const ether = new BigNumber("1e18");

    return (
      <div className="App-content">
        <div className="Transaction">
          <h1>
            Transaction <Hash hash={hash} />
          </h1>
          <table>
            <tr>
              <th>block</th>
              <td>
                <Link to={`/block/${receipt.blockNumber}`}>
                  #{receipt.blockNumber.toFormat(0)}{" "}
                  <small>
                    (<Hash hash={receipt.blockHash} short />)
                  </small>
                </Link>
              </td>
            </tr>
            <tr>
              <th>from</th>
              <td>
                <Link to={`/account/${tx.from}`}>{tx.from}</Link>
              </td>
            </tr>
            {tx.to ? (
              <tr>
                <th>to</th>
                <td>
                  <Link to={`/account/${tx.to}`}>{tx.to}</Link>
                </td>
              </tr>
            ) : null}
            {receipt.contractAddress ? (
              <tr>
                <th>contract address:</th>
                <td>
                  <Link to={`/account/${receipt.contractAddress}`}>
                    {receipt.contractAddress}
                  </Link>
                </td>
              </tr>
            ) : null}
            <tr>
              <th>value</th>
              <td>
                {tx.value.dividedBy(ether).toFormat(4)} Ξ (${tx.value
                  .mul(etherPrice)
                  .dividedBy(ether)
                  .toFormat(5)})
              </td>
            </tr>
            <tr>
              <th>gas used</th>
              <td
                title={`Cumulative: ${receipt.cumulativeGasUsed.toFormat(0)}`}
              >
                {receipt.gasUsed.toFormat(0)} / {tx.gas.toFormat(0)}
              </td>
            </tr>
            <tr>
              <th>gas price</th>
              <td>
                {tx.gasPrice.dividedBy(gwei).toFormat(2)} Gwei{" "}
                <small>
                  (${tx.gasPrice
                    .mul(receipt.gasUsed)
                    .mul(etherPrice)
                    .dividedBy(ether)
                    .toFormat(5)})
                </small>
              </td>
            </tr>
            <tr>
              <th>data</th>
              <td>
                <textarea
                  readOnly
                  defaultValue={tx.input}
                  style={{ height: "1.5rem" }}
                />
              </td>
            </tr>
            <tr>
              <th>logs</th>
              <td>
                <textarea
                  readOnly
                  defaultValue={JSON.stringify(receipt.logs, null, 2)}
                />
              </td>
            </tr>
            <tr>
              <th>public key</th>
              <td>
                <textarea
                  readOnly
                  defaultValue={tx.publicKey}
                  style={{ height: "1rem" }}
                />
              </td>
            </tr>
            <tr>
              <th>raw receipt</th>
              <td>
                <textarea defaultValue={JSON.stringify(receipt, null, 2)} />
              </td>
            </tr>
            <tr>
              <th>raw transaction</th>
              <td>
                <textarea defaultValue={JSON.stringify(tx, null, 2)} />
              </td>
            </tr>
          </table>
        </div>
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
            .slice(-10)
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
      parentHash,
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
        hash={hash}
        parentHash={parentHash}
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
