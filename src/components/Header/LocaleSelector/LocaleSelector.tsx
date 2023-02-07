/**
 * @file LocaleSelector component.
 */

import { useContext, useMemo, useState } from "react";
import { Button, Popover, Paper, Grid, styled, Link} from "@mui/material";
import { Translate, AddBox } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getEmojiFlag } from "../../../utils/getEmojiFlag";
import { getName } from "all-iso-language-codes";
import { ThemeContext } from "../../../store";

// Style locale selector language option button.
const LocaleOptButton = styled(Button)(({ theme }) => ({
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

/** Locale selector component. */
export const LocaleSelector = () => {
  const { i18n, t } = useTranslation();
  const { locale, changeLocale } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "locale-selector" : undefined;

  /**
   * A list of supported Alpha2 shortcodes e.g "en" "nl".
   */
  const supportedLocales = useMemo(() => {
    const lngs = i18n.options.supportedLngs || [];
    return Array.from(new Set(lngs)).filter((l) => l !== "cimode");
  }, [i18n.options.supportedLngs]);

  /**
   * Handle locale selector button click.
   * @param event Click event.
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handle locale selector close.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handle locale change.
   * @param lng Locale to change to.
   */
  const handleLocaleChange = async (lng: string) => {
    await changeLocale(lng);
    handleClose();
  };

  return (
    <>
      <Button aria-describedby={id} variant="text" onClick={handleClick}>
        <Translate />
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
                <LocaleOptButton
                  onClick={() => handleLocaleChange(lng)}
                  disabled={lng === locale ? true : false}
                >
                  <span>{getEmojiFlag(lng)}</span>
                  <span>{getName(lng, i18n.resolvedLanguage)}</span>
                </LocaleOptButton>
              </Grid>
            ))}
            <Grid item xs={6} sm={4} md={3}>
              <Link
                target="_blank"
                href="https://crowdin.com/project/github-emoji-picker"
                underline="none"
              >
                <LocaleOptButton>
                  <AddBox fontSize="small" />
                  {t("localeSelector.translate")}
                </LocaleOptButton>
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Popover>
    </>
  );
};

export default LocaleSelector;
