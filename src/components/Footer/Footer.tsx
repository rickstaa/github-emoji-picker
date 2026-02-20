"use client";

/**
 * @file Contains footer component.
 */
import { Grid, Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

/** Footer component. */
export const Footer = () => {
  const { t } = useTranslation();

  return (
    <Grid container>
      <Grid item pt={1} pb={1}>
        <Typography variant="caption" align="center" pl={1} pr={1}>
          {t("footer.description")}{" "}
          <Link
            href="https://github.com/missive/emoji-mart"
            variant="caption"
            align="center"
            underline="hover"
            target="_blank"
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
