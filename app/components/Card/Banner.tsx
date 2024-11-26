"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ColorizeIcon } from "../custom/ColorizeIcon";
import { Props as TPropsColorizeIcon } from "../custom/ColorizeIcon";
import { Theme, SxProps } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

type TPropsBannerContent = {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

interface TPropsBannerLabel extends TPropsBannerContent {
  Icon: TPropsColorizeIcon["Icon"]["Element"];
  color: string;
}

export function BannerLabel({ label }: { label: string }) {
  return (
    <Typography
      sx={{ fontSize: 14, textTransform: "capitalize" }}
      color='text.secondary'
      gutterBottom
    >
      {label}
    </Typography>
  );
}

export function BannerHeader({ Icon, color, children }: TPropsBannerLabel) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2
      }}
    >
      <ColorizeIcon
        Icon={{
          Element: Icon
        }}
        color={color}
        customContrast={{}}
      />
      {children}
    </Box>
  );
}

export function BannerContent({ children }: TPropsBannerContent) {
  return <Box>{children}</Box>;
}

export default function Banner({ children }: Props) {
  return (
    <Box>
      <Card
        variant='outlined'
        sx={{ borderRadius: 1 }}
      >
        <CardContent
          sx={{
            minHeight: 130,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pb: 0
          }}
        >
          {children}
        </CardContent>
      </Card>
    </Box>
  );
}
