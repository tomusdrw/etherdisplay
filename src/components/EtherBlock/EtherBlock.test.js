import React from "react";
import { shallow } from "enzyme";
import EtherBlock from "./EtherBlock";

it("renders without crashing", () => {
  shallow(<EtherBlock id={0x0000} chain={0x0001} author={0x0002} />);
});
