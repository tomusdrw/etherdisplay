import React from "react";
import { shallow } from "enzyme";
import EtherBlockBox from "./EtherBlockBox";

it("renders without crashing", () => {
  shallow(<EtherBlockBox />);
});
