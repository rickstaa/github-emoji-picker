/**
 * @file Contains header component.
 */
import { Grid, Typography } from "@mui/material";
import { useContext } from "react";
import GitHubButton from "react-github-btn";
import { ThemeContext } from "../../store";
import { ThemeSwitch } from "../ThemeSwitch";

/** Header component. */
export const Header = () => {
  const { mode, toggleMode } = useContext(ThemeContext);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <Grid container direction="row" spacing={1} mt={1}>
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
        <Typography variant="subtitle1">
          A simple emotion picker that displays all the supported GitHub emojis.
        </Typography>
      </Grid>
      <Grid item>
        <Grid container spacing={2} pt={1} pb={1}>
          <Grid item>
            <GitHubButton
              href="https://github.com/rickstaa/github-emoji-picker"
              data-icon="octicon-star"
              data-color-scheme={`no-preference: ${
                mode === "dark" ? "dark_dimmed" : "light"
              }; light: ${mode === "dark" ? "dark_dimmed" : "light"}; dark: ${
                mode === "dark" ? "dark_dimmed" : "light"
              };`}
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
              }; light: ${mode === "dark" ? "dark_dimmed" : "light"}; dark: ${
                mode === "dark" ? "dark_dimmed" : "light"
              };`}
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
              }; light: ${mode === "dark" ? "dark_dimmed" : "light"}; dark: ${
                mode === "dark" ? "dark_dimmed" : "light"
              };`}
              data-icon="octicon-heart"
              aria-label="Sponsor @anuraghazra on GitHub"
            >
              Sponsor
            </GitHubButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item pb={1}>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <ThemeSwitch checked={mode !== "dark"} onClick={toggleMode} />
          </Grid>
          <Grid item>
            <Typography variant="caption">
              Switch to your preferred theme.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Header;
