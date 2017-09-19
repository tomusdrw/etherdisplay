import React from "react";
import { shallow } from "enzyme";
import EtherBlock from "./EtherBlock";

it("renders without crashing", () => {
  shallow(<EtherBlock />);
});
