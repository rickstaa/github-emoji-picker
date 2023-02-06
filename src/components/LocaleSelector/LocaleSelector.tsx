/**
 * @file LocaleSelector component.
 */

import { useCallback, useMemo, useState } from "react";
import {
  Button,
  Popover,
  Paper,
  Grid,
  styled,
} from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { useTranslation } from "react-i18next";
import { getEmojiFlag } from "../../utils/getEmojiFlag";
import { getName, getIsoCodesFromNativeName } from "all-iso-language-codes";

export const LocaleSelector = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  /**
   * The current URL pathname
   */
  const url = new URLSearchParams(window.location.search);

  /**
   * A list of supported Alpha2 shortcodes e.g "en" "nl"
   */
  const supportedLocales = useMemo(
    () =>
      Array.from(new Set(i18n.options.supportedLngs || [])).filter(
        (l) => l !== "cimode"
      ),
    []
  );

  const open = Boolean(anchorEl);
  const id = open ? "locale-selector" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Switches the app locale by appending a query parameter to the URL, e.g. ?lng=en
   * TODO: Changing the locale appears to break for certain locales. https://github.com/missive/emoji-mart/issues/794. UX can be preserved by reloading rather than just re-rendering.
   */
  const setLocale = useCallback((lng: string) => {
    url.set("lng", lng);
    i18n.changeLanguage(lng);

    // Update without reload
    // window.history.pushState({}, "", url.toString());
    
    // Update with reload
    window.location.search = url.toString();
  }, []);

  return (
    <>
      <Button aria-describedby={id} variant="text" onClick={handleClick}>
        <TranslateIcon />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Paper>
          <Grid container spacing={2} maxWidth={600} p={2}>
            {supportedLocales.map((lng) => (
              <Grid item xs={6} sm={4} md={3} key={lng}>
                <LocaleOpt onClick={() => setLocale(lng)}>
                  <span>{getEmojiFlag(lng)}</span>
                  <span>{getName(lng, i18n.resolvedLanguage)}</span>
                </LocaleOpt>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Popover>
    </>
  );
};

export default LocaleSelector;

const LocaleOpt = styled(Button)(({ theme }) => ({
  textTransform: "none",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  alignItems: "center",
  flexDirection: "row",
  gap: 10,
  display: "flex",
  color: theme.palette.text.secondary,
  fontWeight: "bold",
}));
