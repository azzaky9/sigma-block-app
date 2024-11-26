declare module "@mui/material/styles" {
  interface Palette {
    teal: Palette["primary"];
    indigo: Palette["primary"];
  }

  interface PaletteOptions {
    teal?: PaletteOptions["primary"];
    indigo?: Palette["primary"];
  }
}
