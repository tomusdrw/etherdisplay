import React, { Component } from "react";
import TopBar from "./components/TopBar";
import ColorBoard from "./components/ColorBoard";
import EtherBlock from "./components/EtherBlock";
import EtherBlockBox from "./components/EtherBlockBox";
import EtherBlockPanel from "./components/EtherBlockPanel";
import "./App.css";
/*
*/

class App extends Component {
  render() {
    return (
      <div className="App">
        <TopBar />
        <EtherBlockPanel>
          <EtherBlock
            id={4654343}
            author={0x1234567890}
            chain={0xdead000011112222cafe}
            created={new Date("2017-09-22T07:00:00.000Z")}
            gas={1300000}
            gasMax={14700000}
            transactionNo={3}
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
        </EtherBlockPanel>
        <EtherBlockBox />
      </div>
    );
  }
}

export default App;
