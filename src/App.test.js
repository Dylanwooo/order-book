import { render, screen } from "@testing-library/react";
import App from "./App";
import React from "react";

it("renders orderbook content", () => {
  render(<App />);
  const content = screen.getByText("Price(USD)");
  expect(content).toBeInTheDocument();
});
