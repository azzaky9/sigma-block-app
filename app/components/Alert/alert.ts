import { enqueueSnackbar } from "notistack";

export const shortenAlert = (
  variant: "success" | "error" | "warning" | "info",
  message: string
) => {
  return enqueueSnackbar({
    variant,
    message
  });
};
