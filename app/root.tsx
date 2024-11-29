import * as React from "react";

import { LinksFunction } from "@remix-run/node";
import DateProvider from "@/context/DateProvider";
import { NuqsAdapter } from "nuqs/adapters/remix";
import SnackbarProvider from "@/context/SnackbarProvider";
import { LocationProvider } from "@/context/LocationProvider";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

import { MuiMeta } from "./lib/mui/MuiMeta";
import { getMuiLinks } from "./lib/mui/getMuiLinks";
import { MuiDocument } from "./lib/mui/MuiDocument";
import { TrpcProvider } from "./utils/trpc-provider";

import "./tailwind.css";

export const links: LinksFunction = () => [...getMuiLinks()];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <MuiMeta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MuiDocument>
      <TrpcProvider>
        <NuqsAdapter>
          <DateProvider>
            <SnackbarProvider>
              <LocationProvider>
                <Outlet />
              </LocationProvider>
            </SnackbarProvider>
          </DateProvider>
        </NuqsAdapter>
      </TrpcProvider>
    </MuiDocument>
  );
}
