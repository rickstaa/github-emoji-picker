/**
 * @file Test rendering of the App component.
 */
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders App", () => {
  render(<App />);
  const textElement = screen.getByText(/A small tool/i);
  expect(textElement).toBeInTheDocument();
});
