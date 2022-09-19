/**
 * @file Contains the app themes.
 */
import { createTheme } from "@mui/material/styles";

/** Dark theme. */
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#202124" },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    caption: {
      color: "lightgrey",
    },
  },
});

/** Light theme. */
const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#eaedf0" },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    caption: {
      color: "grey",
    },
  },
});

/** Themes type. */
interface Themes {
  [key: string]: typeof darkTheme;
}

/** Themes object. */
export const themes: Themes = {
  dark: darkTheme,
  light: lightTheme,
};

export default themes;
