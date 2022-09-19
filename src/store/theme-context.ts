/**
 * @file Theme store.
 */
import { createContext } from "react";

/** Stores theme information. */
export const ThemeContext = createContext({
  mode: "dark",
  toggleMode: () => {},
});

export default ThemeContext;
