/**
 * @file Main App file.
 */
import { CssBaseline, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import themes from "./assets/themes";
import { Emoji, EmojiPicker } from "./components/EmojiPicker";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Snackbar } from "./components/Snackbar";
import { ThemeContext } from "./store";

/**
 * Get the mart locale.
 *
 * @param locale The locale to get the mart locale for.
 * @returns The mart locale.
 *
 * @description Mart sometimes uses a different locale code than the one that is
 * universally used.
 */
const getMartLocale = (locale: string) => {
  return locale === "kr" ? "kr" : locale;
};

//== Types ==

/** Snackbar message. */
export interface SnackbarMessage {
  message: string;
  key: number;
}

/** The main app */
const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { i18n } = useTranslation();
  const [mode, setMode] = useState(() => {
    return (
      window.localStorage.getItem("mode") ||
      (prefersDarkMode ? "dark" : "light")
    );
  });
  const [locale, setLocale] = useState(() => {
    return (
      window.localStorage.getItem("locale") || i18n.resolvedLanguage || "en"
    );
  });
  const martLocale = useMemo(() => getMartLocale(locale), [locale]);
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(
    undefined
  );

  /* Store theme mode in local storage. */
  useEffect(() => {
    window.localStorage.setItem("mode", mode);
  }, [mode]);

  /* Store locale in local storage. */
  useEffect(() => {
    window.localStorage.setItem("locale", locale);
  }, [locale]);

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

  /**
   * Changes the UI locale.
   *
   * @param lcl Locale to change to.
   */
  const changeLocale = async (lcl: string) => {
    setLocale(lcl);
    await i18n.changeLanguage(lcl);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleMode: toggleThemeMode,
        locale,
        changeLocale,
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
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              locale={martLocale}
            />
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
