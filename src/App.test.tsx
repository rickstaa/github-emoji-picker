/**
 * @file Test rendering of the App component.
 */
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock IntersectionObserver because it is only available in the browser and react lazy
// uses it.
beforeEach(() => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

// == Mocks ==

// Mock emoji-mart.
jest.mock("./components/EmojiPicker", () => ({
  EmojiPicker: (props: any) => (
    <div>
      {props.title} {props.description}
    </div>
  ),
}));

// Mock react-i18next.
jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
        options: {
          supportedLngs: ["en", "kr"],
        },
      },
    };
  },
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
}));

/**
 * App rendering test.
 */
test("renders App", async () => {
  render(<App />);
  const textElement = await screen.findByText("GitHub Emoji Picker");
  expect(textElement).toBeInTheDocument();
});
