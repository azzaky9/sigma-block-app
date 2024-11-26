"use client";

import * as React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { faker } from "@faker-js/faker";

const xLabels = moment.months();
const uData = Array.from({ length: xLabels.length }).map((_, i) =>
  faker.number.int()
);
const pData = Array.from({ length: xLabels.length }).map((_, i) =>
  faker.number.int()
);

const AnalyticsOrder = () => {
  return (
    <Stack gap={2}>
      <Paper
        variant='outlined'
        sx={{ width: "100%", mt: 2 }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <DatePicker
            disablePast
            slotProps={{
              textField: { size: "small" },
              inputAdornment: {
                position: "start"
              }
            }}
            views={["year"]}
          />
        </Box>
      </Paper>
      <Paper>
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{ px: 2, pt: 1 }}
            color='text.secondary'
          >
            Periode: {"2023 - 2024"}
          </Typography>
        </Box>
        <BarChart
          series={[
            { data: [35, 44, 24, 34] },
            { data: [51, 6, 49, 30] },
            { data: [15, 25, 30, 50] },
            { data: [60, 50, 15, 25] }
          ]}
          height={500}
          xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
          margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        />
      </Paper>
    </Stack>
  );
};

export default AnalyticsOrder;
