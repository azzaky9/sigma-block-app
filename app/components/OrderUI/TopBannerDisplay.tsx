"use client";

import * as React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { green, deepOrange, deepPurple } from "@mui/material/colors";
import Banner, {
  BannerContent,
  BannerHeader,
  BannerLabel
} from "../Card/Banner";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Sell from "@mui/icons-material/Sell";
import Sync from "@mui/icons-material/Sync";
import { trpc } from "@/client/trpc-client";
import { useCurrency } from "@/app/@hooks/useCurrency";

const TopBannerDisplay = () => {
  const { data, isLoading, isError } = trpc.getBannerInfo.useQuery();

  const currency = useCurrency();

  const mapIcon = {
    success: {
      icon: CheckCircle,
      color: green[600]
    },
    process: { icon: Sync, color: deepPurple[600] },
    omset: { icon: Sell, color: deepOrange[600] }
  };

  type HashIcon = typeof mapIcon;

  function getLabel(keyof: keyof HashIcon) {
    switch (keyof) {
      case "success":
        return "Order Berhasil";
      case "process":
        return "Order di Proses";
      case "omset":
        return "Omset";
    }
  }

  return (
    <Stack
      direction="row"
      gap={3}
      sx={{ px: 1, width: "100%" }}
    >
      {Object.entries(data || {}).map(([key, value]) => (
        <Box
          sx={{ flex: 1 }}
          key={key}
        >
          <Banner>
            <BannerHeader
              Icon={mapIcon[key as keyof HashIcon].icon}
              color={mapIcon[key as keyof HashIcon].color}
            >
              <BannerLabel label={getLabel(key as keyof HashIcon)} />
            </BannerHeader>
            <BannerContent>
              <Typography
                variant="h5"
                fontWeight={500}
              >
                {key === "omset"
                  ? currency.formatCurrency(value)
                  : value > 0
                  ? value
                  : 0}
              </Typography>
            </BannerContent>
          </Banner>
        </Box>
      ))}
    </Stack>
  );
};

export default TopBannerDisplay;
