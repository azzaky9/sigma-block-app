import * as React from "react";

import { CssBaseline } from "@mui/material";
import DateProvider from "@/context/DateProvider";
import { withEmotionCache } from "@emotion/react";
import SnackbarProvider from "@/context/SnackbarProvider";
import { LocationProvider } from "@/context/LocationProvider";
import ClientStyleContext from "@/context/ClientStyleContext";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError
} from "@remix-run/react";
import { NuqsAdapter } from "nuqs/adapters/remix";
import RQProviders from "./context/RQProvider";
import { TrpcProvider } from "./utils/trpc-provider";

import "./tailwind.css";

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = React.useContext(ClientStyleContext);

    useEnhancedEffect(() => {
      emotionCache.sheet.container = document.head;

      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });

      clientStyleData.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1"
          />
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          />
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
        </head>
        <body>
          <TrpcProvider>
            <RQProviders>{children}</RQProviders>
          </TrpcProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <NuqsAdapter>
        <DateProvider>
          <SnackbarProvider>
            <LocationProvider>
              <CssBaseline enableColorScheme />
              <Outlet />
            </LocationProvider>
          </SnackbarProvider>
        </DateProvider>
      </NuqsAdapter>
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = (
          <p>
            Oops! Looks like you tried to visit a page that you do not have
            access to.
          </p>
        );
        break;
      case 404:
        message = (
          <p>Oops! Looks like you tried to visit a page that does not exist.</p>
        );
        break;

      default:
        throw new Error(error.data || error.statusText);
    }

    return (
      <Document title={`${error.status} ${error.statusText}`}>
        <h1>
          {error.status}: {error.statusText}
        </h1>
        {message}
      </Document>
    );
  }

  if (error instanceof Error) {
    console.error(error);
    return (
      <Document title="Error!">
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>Application Crash, try to reload the app</p>
        </div>
      </Document>
    );
  }

  return <h1>Unknown Error</h1>;
}
