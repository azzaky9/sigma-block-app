import { MaterialDesignContent, SnackbarProvider as Snackbar } from "notistack";

import { styled } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import Fade from "@/components/Transition/FadeTransition";
import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Info from "@mui/icons-material/Info";
import Warning from "@mui/icons-material/Warning";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-success": {
    backgroundColor: "white",
    color: "black",
    boxShadow: "none",
    border: `1px solid ${grey["300"]}`
  },
  "&.notistack-MuiContent-error": {
    backgroundColor: "white",
    color: "black",
    boxShadow: "none",
    border: `1px solid ${grey["300"]}`
  },
  "&.notistack-MuiContent-warning": {
    backgroundColor: "white",
    color: "black",
    boxShadow: "none",
    border: `1px solid ${grey["300"]}`
  },
  "&.notistack-MuiContent-info": {
    backgroundColor: "white",
    color: "black",
    boxShadow: "none",
    border: `1px solid ${grey["300"]}`
  }
}));

type Props = {
  children: React.ReactNode;
};

const SnackbarProvider = ({ children }: Props) => (
  <Snackbar
    Components={{
      success: StyledMaterialDesignContent,
      error: StyledMaterialDesignContent,
      info: StyledMaterialDesignContent,
      warning: StyledMaterialDesignContent
    }}
    autoHideDuration={2000}
    iconVariant={{
      success: (
        <CheckCircle
          sx={(theme) => ({ color: theme.palette.success.main })}
          style={{ marginRight: "9px" }}
        />
      ),
      error: (
        <Cancel
          sx={(theme) => ({ color: theme.palette.error.main })}
          style={{ marginRight: "9px" }}
        />
      ),
      warning: (
        <Warning
          sx={(theme) => ({ color: theme.palette.warning.main })}
          style={{ marginRight: "9px" }}
        />
      ),
      info: (
        <Info
          sx={{ color: blue["600"] }}
          style={{ marginRight: "9px" }}
        />
      )
    }}
    TransitionComponent={Fade}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right"
    }}
  >
    {children}
  </Snackbar>
);

export default SnackbarProvider;
