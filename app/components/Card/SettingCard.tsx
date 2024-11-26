"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import PrimaryProfile from "../Profile/PrimaryProfile";

const SettingCard = () => {
  return (
    <Card
      sx={{
        px: 1,
        marginTop: "12px"
      }}
    >
      <CardHeader title='Profil' />
      <CardContent>
        <PrimaryProfile />
      </CardContent>
    </Card>
  );
};

export default SettingCard;
