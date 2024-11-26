"use client";

import React from "react";
import moment from "moment";
import { DatePicker as Picker } from "@mui/x-date-pickers";

export const DatePicker = () => {
  return (
    <div className='mb-2 w-full flex justify-end'>
      <Picker  defaultValue={moment()} />
    </div>
  );
};
