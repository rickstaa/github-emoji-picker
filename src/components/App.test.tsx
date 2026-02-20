/**
 * @file Test rendering of the App component.
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import App from "./App";

// Mock IntersectionObserver because it is only available in the browser and react lazy
// uses it.
beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

// == Mocks ==

// Mock emoji-mart.
vi.mock("@/components/EmojiPicker/EmojiPicker", () => ({
  default: (props: any) => <div data-testid="emoji-picker">EmojiPicker</div>,
  EmojiPicker: (props: any) => (
    <div data-testid="emoji-picker">EmojiPicker</div>
  ),
}));

// Mock react-i18next.
vi.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
        resolvedLanguage: "en",
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

// Mock i18n initialization to prevent HTTP backend requests.
vi.mock("@/i18n", () => ({ default: {} }));

describe("App", () => {
  it("renders the header title", async () => {
    render(<App />);
    const textElement = await screen.findByText("GitHub Emoji Picker");
    expect(textElement).toBeInTheDocument();
  });
});
