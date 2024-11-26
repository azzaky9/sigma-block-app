"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function StatusCard() {
  return (
    <Card
      sx={{ display: "flex", minWidth: "350px" }}
      className='bg-green-200'
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography
            component='div'
            variant='h5'
            fontWeight='bold'
          >
            Insert Today
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
