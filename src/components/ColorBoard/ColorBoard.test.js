import React from "react";
import ReactDOM from "react-dom";
import ColorBoard from "./ColorBoard";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ColorBoard />, div);
});
