/**
 * @file Contains custom snackbar.
 */
import { Alert, Snackbar as MUISnackbar, SnackbarProps } from "@mui/material";

/**
 * Snackbar message.
 */
export interface SnackbarMessage {
  message: string;
  key: number;
}

/** Custom snackbar props. */
interface CustomSnackbarProps extends SnackbarProps {
  messageInfo?: SnackbarMessage;
  open: boolean;
  onClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
  onExited: () => void;
}

/**
 * A customized MUI snackbar component.
 * @param param0
 * @returns Snackbar component.
 */
export const Snackbar = ({
  messageInfo,
  open,
  onClose,
  onExited,
  ...rest
}: CustomSnackbarProps) => {
  return (
    <MUISnackbar
      key={messageInfo ? messageInfo.key : undefined}
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      TransitionProps={{ onExited }}
      {...rest}
    >
      <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
        {messageInfo ? messageInfo.message : undefined}
      </Alert>
    </MUISnackbar>
  );
};

export default Snackbar;
