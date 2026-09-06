/**
 * @file Theme store.
 */
import { createContext } from "react";

/** Stores theme information. */
export const ThemeContext = createContext({
  mode: "dark",
  toggleMode: () => {},
  locale: "en",
  changeLocale: async (lcl: string) => {},
  showNonGithub: false,
  toggleNonGithub: () => {},
});

export default ThemeContext;
