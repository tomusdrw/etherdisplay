import React from "react";
import ReactDOM from "react-dom";
import EtherBlockPanel from "./EtherBlockPanel";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<EtherBlockPanel />, div);
});
