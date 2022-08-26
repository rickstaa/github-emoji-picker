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
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import GitHubButton from "react-github-btn";
import customGithubEmojis from "./data/github_custom_emojis.json";
import data from "./data/github_emojis.json";

/* Types */
export interface SnackbarMessage {
  message: string;
  key: number;
}
export interface State {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

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

  const custom = [
    {
      name: "GitHub",
      emojis: [
        {
          id: "octocat",
          name: "Octocat",
          keywords: ["octocat"],
          skins: [
            {
              src: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            },
          ],
        },
      ],
    },
  ];

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
            <MaterialUISwitch
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
              categoryIcons={{
                github: {
                  src: "https://cdns.iconmonstr.com/wp-content/releases/preview/2012/240/iconmonstr-github-1.png",
                },
              }}
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
