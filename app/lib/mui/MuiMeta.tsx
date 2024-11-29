import { theme } from "@/utils/theme";

export function MuiMeta() {
  return (
    <meta
      name="theme-color"
      content={theme.palette.primary.main}
    />
  );
}
