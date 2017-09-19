import React, { Component } from 'react';
import EtherBlock from './components/EtherBlock';
import EtherBlockPanel from './components/EtherBlockPanel';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <EtherBlockPanel>
          <EtherBlock
            id={4654343}
            author={0x1234567890}
            chain={0xdead000011112222cafe}
            created={Date.now()}
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
        </EtherBlockPanel>
      </div>
    );
  }
}

export default App;
