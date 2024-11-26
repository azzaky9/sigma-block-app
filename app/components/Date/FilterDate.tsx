import * as React from "react";

import moment from "moment";
import { parseAsInteger, parseAsIsoDateTime, useQueryStates } from "nuqs";

import { Button } from "@mui/material";
import { PickerModal } from "mui-daterange-picker-plus/dist";
import type { DateRange } from "mui-daterange-picker-plus/dist";
import EventNote from "@mui/icons-material/EventNote";

export default function FilterDate() {
  const date = moment();

  const [filterDate, setFilterDate] = useQueryStates({
    itemId: parseAsInteger,
    from: parseAsIsoDateTime.withDefault(date.startOf("month").toDate()),
    to: parseAsIsoDateTime.withDefault(date.endOf("month").toDate())
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const handleSetDateRangeOnSubmit = (dateRange: DateRange) => {
    setFilterDate({
      from: dateRange.startDate,
      to: dateRange.endDate
    });
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<EventNote />}
        onClick={handleClick}
      >
        Atur Tanggal
      </Button>
      <PickerModal
        initialDateRange={{
          startDate: filterDate.from,
          endDate: filterDate.to
        }}
        customProps={{
          onSubmit: (range: DateRange) => handleSetDateRangeOnSubmit(range),
          onCloseCallback: handleClose
        }}
        modalProps={{
          open,
          anchorEl,
          onClose: handleClose,
          slotProps: {
            paper: {
              sx: {
                borderRadius: "16px",
                boxShadow: "rgba(0, 0, 0, 0.21) 0px 0px 4px"
              }
            }
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
          }
        }}
      />
    </>
  );
}
