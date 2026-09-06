"use client";

/**
 * @file Main App component.
 */
import { CssBaseline, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import themes from "@/assets/themes";
import type { Emoji } from "@/components/EmojiPicker";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Snackbar } from "@/components/Snackbar";
import { Loading } from "@/components/Loading";
import nonGithubEmojis from "@/data/non_github_emojis.json";
import { ThemeContext } from "@/store";
import { parseShortCodes, unifiedToUnicodeEmoji } from "@/utils/utils";
import "@/i18n";

const EmojiPicker = lazy(() => import("@/components/EmojiPicker/EmojiPicker"));

/** Ids of the emojis GitHub does not support yet. */
const nonGithubEmojiIds = new Set<string>(nonGithubEmojis);

/**
 * Whether emojis GitHub does not support should be shown.
 *
 * @description The `non_github` URL parameter takes precedence over local storage.
 */
const getShowNonGithub = () => {
  const param = new URLSearchParams(window.location.search).get("non_github");
  if (param !== null) {
    const show = param.toLowerCase() === "true";
    window.localStorage.setItem("nonGithub", String(show));
    return show;
  }
  return window.localStorage.getItem("nonGithub") === "true";
};

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
  return locale === "ko" ? "kr" : locale;
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
    undefined,
  );
  const [copyUnicode, setCopyUnicode] = useState(false); // Whether to copy the unicode instead of the shortcode.
  const [showNonGithub] = useState(getShowNonGithub);
  const exceptEmojis = useMemo(
    () => (showNonGithub ? [] : nonGithubEmojis),
    [showNonGithub],
  );

  /* Store theme mode in local storage. */
  useEffect(() => {
    window.localStorage.setItem("mode", mode);
  }, [mode]);

  /* Store locale in local storage. */
  useEffect(() => {
    window.localStorage.setItem("locale", locale);
  }, [locale]);

  /* Get copy type from URL query params. */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let copyType = urlParams.get("copy_type");

    // Change copy based on query param.
    if (copyType) {
      switch (copyType.toLowerCase()) {
        case "unicode":
          window.localStorage.setItem("copyType", "unicode");
          setCopyUnicode(true);
          return;
        case "shortcode":
        default:
          window.localStorage.setItem("copyType", "shortcode");
          setCopyUnicode(false);
          return;
      }
    }

    // Change copy based on local storage.
    copyType = window.localStorage.getItem("copyType");
    setCopyUnicode(copyType === "unicode");
  }, []);

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
    reason?: string,
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
   *
   * @description Copies the unicode or shortcode to the clipboard. Depends on the
   * copyUnicode state and whether the shift key is pressed.
   */
  const handleEmojiSelect = (selectedEmoji: Emoji, event: PointerEvent) => {
    // Emojis GitHub does not support have no shortcode, so always copy the unicode.
    if (nonGithubEmojiIds.has(selectedEmoji.id)) {
      navigator.clipboard.writeText(
        unifiedToUnicodeEmoji(selectedEmoji?.unified),
      );
      setSnackPack((prev) => [
        ...prev,
        {
          message:
            "Emoji 'unicode' copied to clipboard. GitHub does not support this emoji yet, so it has no 'shortcode'.",
          key: new Date().getTime(),
        },
      ]);
      return;
    }

    let copyText;
    if (event.shiftKey) {
      copyText = copyUnicode
        ? parseShortCodes(selectedEmoji.shortcodes)[0]
        : unifiedToUnicodeEmoji(selectedEmoji?.unified);
    } else {
      copyText = copyUnicode
        ? unifiedToUnicodeEmoji(selectedEmoji?.unified)
        : parseShortCodes(selectedEmoji.shortcodes)[0];
    }

    // Create snackbar message.
    let snackbarMessage: string;
    if (copyText === "") {
      copyText = selectedEmoji.shortcodes;
      snackbarMessage =
        "Emoji 'shortcode' copied to clipboard since 'unicode' is not available.";
    } else {
      const copyTypeStrings = copyUnicode
        ? ["unicode", "shortcode"]
        : ["shortcode", "unicode"];
      if (event.shiftKey) {
        snackbarMessage = `Emoji '${copyTypeStrings[1]}' copied to clipboard.`;
      } else {
        snackbarMessage = `Emoji '${copyTypeStrings[0]}' copied to clipboard. ${
          selectedEmoji.unified
            ? "Hold shift for '" + copyTypeStrings[1] + "'."
            : ""
        }`;
      }
    }

    // Copy to clipboard and display snackbar.
    navigator.clipboard.writeText(copyText);
    setSnackPack((prev) => [
      ...prev,
      {
        message: snackbarMessage,
        key: new Date().getTime(),
      },
    ]);
  };

  /** Toggles theme mode. */
  const toggleThemeMode = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  /**
   * Toggles whether emojis GitHub does not support are shown.
   *
   * @description Reloads the page because emoji-mart filters its emoji data once,
   * when the picker mounts, and cannot add emojis back afterwards.
   */
  const toggleNonGithub = () => {
    window.localStorage.setItem("nonGithub", String(!showNonGithub));
    const url = new URL(window.location.href);
    url.searchParams.delete("non_github");
    window.location.replace(url);
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
        showNonGithub,
        toggleNonGithub,
      }}
    >
      <ThemeProvider theme={themes[mode]}>
        <CssBaseline />
        <Suspense fallback={<Loading />}>
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
                exceptEmojis={exceptEmojis}
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
        </Suspense>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;
