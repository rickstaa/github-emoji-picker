/**
 * @file Main App file.
 */
import { CssBaseline, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useEffect, useState } from "react";
import themes from "./assets/themes";
import { Emoji, EmojiPicker } from "./components/EmojiPicker";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Snackbar } from "./components/Snackbar";
import { ThemeContext } from "./store";

//== Types ==

/** Snackbar message. */
export interface SnackbarMessage {
  message: string;
  key: number;
}

/** The main app */
const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(() => {
    return (
      window.localStorage.getItem("mode") ||
      (prefersDarkMode ? "dark" : "light")
    );
  });
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(
    undefined
  );

  /* Store theme mode in local storage. */
  useEffect(() => {
    window.localStorage.setItem("mode", mode);
  }, [mode]);

  /* Implements snackbar functionality. */
  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one.
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added.
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  /**
   * Handles (user) snackbar close event.
   *
   * @param event Event object.
   * @param reason Event reason.
   * @returns void
   */
  const handleSnackClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  /**
   * Handles snackbar exited event.
   */
  const handleSnackExited = () => {
    setMessageInfo(undefined);
  };

  /**
   * Handles selection of the emoji.
   *
   * @param selectedEmoji Selected emoji.
   */
  const handleEmojiSelect = (selectedEmoji: Emoji) => {
    // Copy emoji shortcode to clipboard.
    navigator.clipboard.writeText(selectedEmoji.shortcodes);
    // Display snackbar
    setSnackPack((prev) => [
      ...prev,
      {
        message: "Emoji shortcode copied to clipboard",
        key: new Date().getTime(),
      },
    ]);
  };

  /** Toggles theme mode. */
  const toggleThemeMode = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleMode: toggleThemeMode,
      }}
    >
      <ThemeProvider theme={themes[mode]}>
        <CssBaseline />
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          wrap="nowrap"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item>
            <Header />
          </Grid>
          <Grid item justifyContent="center">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </Grid>
          <Grid item>
            <Footer />
          </Grid>
        </Grid>
        <Snackbar
          messageInfo={messageInfo}
          open={open}
          onClose={handleSnackClose}
          onExited={handleSnackExited}
        />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;
