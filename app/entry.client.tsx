import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";
import { CacheProvider } from "@emotion/react";
import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ClientStyleContext from "@/context/ClientStyleContext";
import createEmotionCache from "@/utils/createEmotionCache";

import GlobalInjectStyle from "./context/GlobalInjectStyle";

import { indigo, teal } from "@mui/material/colors";

interface ClientCacheProviderProps {
  children: React.ReactNode;
}
function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = React.useState(createEmotionCache());

  const clientStyleContextValue = React.useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache());
      }
    }),
    []
  );

  return (
    <ClientStyleContext.Provider value={clientStyleContextValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

const hydrate = () => {
  const theme = createTheme({
    cssVariables: true,
    palette: {
      background: {
        default: "rgb(250, 250, 251)"
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

  React.startTransition(() => {
    ReactDOM.hydrateRoot(
      document,
      <ClientCacheProvider>
        <ThemeProvider theme={theme}>
          <GlobalInjectStyle>
            <RemixBrowser />
          </GlobalInjectStyle>
        </ThemeProvider>
      </ClientCacheProvider>
    );
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  setTimeout(hydrate, 1);
}
