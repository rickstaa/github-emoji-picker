/**
 * @file Contains footer component.
 */
import { Grid, Link, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <Grid container>
      <Grid item pt={1} pb={1}>
        <Typography variant="caption" align="center" pl={1} pr={1}>
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
  );
};

export default Footer;
