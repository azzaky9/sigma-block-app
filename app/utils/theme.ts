import { createTheme } from "@mui/material";
import { indigo, teal } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    teal: {
      main: string;
      dark: string;
      light: string;
    };
    indigo: {
      dark: string;
      main: string;
      light: string;
      contrastText: string;
    };
  }
  interface PaletteOptions {
    teal?: {
      main: string;
      dark: string;
      light: string;
    };
    indigo?: {
      dark: string;
      main: string;
      light: string;
      contrastText: string;
    };
  }
}

const theme = createTheme({
  cssVariables: true,
  palette: {
    background: {
      default: "rgb(248 250 252)"
    },
    info: {
      main: "#007AFF"
    },
    primary: {
      light: "#312ECB",
      main: "#312ECB"
    },
    secondary: {
      light: "#0F0934",
      main: "#0F0934"
    },
    teal: {
      main: teal[500],
      dark: teal[900],
      light: teal.A200
    },
    indigo: {
      dark: indigo[900],
      main: indigo["A700"],
      light: indigo["A100"],
      contrastText: "#ffff"
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    }
  }
});

export { theme };
