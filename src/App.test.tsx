/**
 * @file Test rendering of the App component.
 */
import { render, screen } from "@testing-library/react";
import App from "./App";

// == Mocks ==
// MOCK react-github-btn
// TODO: Can be removed if https://github.com/buttons/react-github-btn/issues/27 is fixed.
jest.mock("react-github-btn", () => () => <>Button</>);

// Mock emoji-mart
jest.mock("./components/EmojiPicker", () => ({
  EmojiPicker: (props: any) => (
    <div>
      {props.title} {props.description}
    </div>
  ),
}));

/**
 * App rendering test.
 */
test("renders App", () => {
  render(<App />);
  const textElement = screen.getByText(
    /A simple emotion picker that displays all /i
  );
  expect(textElement).toBeInTheDocument();
});
