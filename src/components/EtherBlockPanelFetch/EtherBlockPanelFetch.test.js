import React from "react";
import ReactDOM from "react-dom";
import EtherBlockPanelFetch from "./EtherBlockPanelFetch";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<EtherBlockPanelFetch />, div);
});
