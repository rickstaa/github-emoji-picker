/**
 * @file Main App file.
 */
import Picker from "@emoji-mart/react";
import {
  Alert,
  Container,
  CssBaseline,
  Grid,
  Link,
  Snackbar,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import GitHubButton from "react-github-btn";
import { ThemeSwitch } from "./components/ThemeSwitch";
import customGithubEmojis from "./data/github_custom_emojis.json";
import data from "./data/github_emojis.json";

/** Types */
export interface SnackbarMessage {
  message: string;
  key: number;
}
export interface State {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

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

const dayTheme = createTheme({
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

const customEmojiCategories = {
  github: {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 25px 25px"><path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27" /></svg>',
  },
};

const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const preferredMode = prefersDarkMode ? "dark" : "light";
  const [mode, setMode] = useState(preferredMode);

  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(
    undefined
  );

  /* Initialize snackbar functionality. */
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

  /* Handles the close of the snackbar. */
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  /* Handles the exit of the snackbar. */
  const handleExited = () => {
    setMessageInfo(undefined);
  };

  /** Copies Latex Equation to Clipboard **/
  const copyClipboard = (input: any) => {
    navigator.clipboard.writeText(input.shortcodes);
    // Display snackbar
    setSnackPack((prev) => [
      ...prev,
      {
        message: "Emoji shortcode copied to clipboard",
        key: new Date().getTime(),
      },
    ]);
  };

  const handleThemeChange = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };
  console.log(data);
  console.log(customGithubEmojis);
  const customEmojis = [customGithubEmojis];

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : dayTheme}>
      <CssBaseline />
      <Container>
        <Grid
          container
          direction="column"
          justifyContent="center"
          wrap="nowrap"
          alignItems="center"
          spacing={1}
          sx={{ height: "100vh" }}
        >
          {/* Header */}
          <Grid item>
            <Grid
              container
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="h4" gutterBottom>
                  GitHub Emoji Picker
                </Typography>
              </Grid>
              <Grid item>
                <img
                  alt="OctoCat"
                  src="https://github.githubassets.com/images/icons/emoji/octocat.png"
                  style={{ width: "3rem" }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" align="center">
              A simple emotion picker that displays all the supported GitHub
              emojis.
            </Typography>
          </Grid>
          <Grid item>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <GitHubButton
                  href="https://github.com/rickstaa/github-emoji-picker"
                  data-icon="octicon-star"
                  data-color-scheme={`no-preference: ${
                    mode === "dark" ? "dark_dimmed" : "light"
                  }; light: ${
                    mode === "dark" ? "dark_dimmed" : "light"
                  }; dark: ${mode === "dark" ? "dark_dimmed" : "light"};`}
                  data-show-count="true"
                  aria-label="Star rickstaa/github-emoji-picker on GitHub"
                >
                  Star
                </GitHubButton>
              </Grid>
              <Grid item>
                <GitHubButton
                  href="https://github.com/rickstaa/github-emoji-picker/fork"
                  data-color-scheme={`no-preference: ${
                    mode === "dark" ? "dark_dimmed" : "light"
                  }; light: ${
                    mode === "dark" ? "dark_dimmed" : "light"
                  }; dark: ${mode === "dark" ? "dark_dimmed" : "light"};`}
                  data-icon="octicon-repo-forked"
                  data-show-count="true"
                  aria-label="Fork rickstaa/github-emoji-picker on GitHub"
                >
                  Fork
                </GitHubButton>
              </Grid>
              <Grid item>
                <GitHubButton
                  href="https://github.com/sponsors/rickstaa"
                  data-color-scheme={`no-preference: ${
                    mode === "dark" ? "dark_dimmed" : "light"
                  }; light: ${
                    mode === "dark" ? "dark_dimmed" : "light"
                  }; dark: ${mode === "dark" ? "dark_dimmed" : "light"};`}
                  data-icon="octicon-heart"
                  aria-label="Sponsor @anuraghazra on GitHub"
                >
                  Sponsor
                </GitHubButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <ThemeSwitch
              checked={mode !== "dark"}
              onClick={handleThemeChange}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption">
              Switch to your preferred theme.
            </Typography>
          </Grid>
          {/* Emoji Picker */}
          <Grid item>
            <Picker
              data={data}
              custom={customEmojis}
              categoryIcons={customEmojiCategories}
              onEmojiSelect={copyClipboard}
              theme={mode === "dark" ? "dark" : "light"}
              sx={{ pt: "1", pb: "1" }}
            />
          </Grid>
          {/* Footer */}
          <Grid item pb={2}>
            <Typography variant="caption" align="center">
              Created with{" "}
              <Link
                href="https://github.com/missive/emoji-mart"
                variant="caption"
                align="center"
                underline="hover"
              >
                emoji-mart🏪
              </Link>
              .
            </Typography>
          </Grid>
        </Grid>
      </Container>
      {/* Snackbar */}
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionProps={{ onExited: handleExited }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {messageInfo ? messageInfo.message : undefined}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
