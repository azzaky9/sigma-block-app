"use client";

import * as React from "react";
import { Box, alpha, IconProps, lighten } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

export type Props = {
  Icon: {
    Element: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
      muiName: string;
    };
    IconProps?: IconProps;
  };
  LucideIcon?: React.ReactNode;
  customContrast: {
    outer?: number;
    icon?: number;
  };
  color: string;
  label?: string;
};

export const ColorizeIcon = (props: Props) => {
  const { LucideIcon, Icon, color, customContrast, label = "Untlited" } = props;
  const { outer = 0.2, icon = 0.1 } = customContrast;
  const { Element, IconProps } = Icon;

  return (
    <Box
      sx={{
        p: 0.5,
        bgcolor: alpha(color, outer),
        borderRadius: "4px",
        display: "grid",
        placeContent: "center"
      }}
    >
      {!!LucideIcon ? (
        LucideIcon
      ) : (
        <Element sx={{ color: lighten(color, icon), fontSize: 21 }} />
      )}
    </Box>
  );
};
