/* @flow */
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TopBar from "./components/TopBar";
import ColorBoard from "./components/ColorBoard";
import EtherBlock from "./components/EtherBlock";
import EtherBlockBox from "./components/EtherBlockBox";
import EtherBlockPanel from "./components/EtherBlockPanel";
import EtherBlockPanelFetch from "./components/EtherBlockPanelFetch";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <TopBar />
        <Router>
          <Switch>
            <Route exact path="/" component={EtherBlockPanelFetch} />
            <Route
              path="/block/:id"
              render={({ match }) => <EtherBlockBox id={match.params.id} />}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
