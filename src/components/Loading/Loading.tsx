"use client";

/**
 * @file Contains loading component.
 */
import { CircularProgress, Grid } from "@mui/material";

/** Loading component. */
export const Loading = () => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item>
        <CircularProgress size="3rem" />
      </Grid>
    </Grid>
  );
};

export default Loading;
