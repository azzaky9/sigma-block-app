import { StyledEngineProvider } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export default function GlobalInjectStyle({ children }: Props) {
  return <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>;
}
