"use cleint";

import React from "react";
import { Field, FieldProps } from "formik";
import { MenuItem, Select } from "@mui/material";

interface Option {
  label: string;
  value: any;
}

interface ControlledSelectProps {
  options: Option[];
  label: string;
  name: string;
}

const ITEM_HEIGHT = 50;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5,
      width: 250
    }
  }
};

const ControlledSelect: React.FC<ControlledSelectProps> = ({
  options,
  label,
  name
}) => {
  return (
    <Field name={name}>
      {({ field }: FieldProps) => (
        <Select
          variant='standard'
          {...field}
          id={name}
          MenuProps={MenuProps}
        >
          <MenuItem
            value=''
            disabled
          >
            {label}
          </MenuItem>
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    </Field>
  );
};

export default ControlledSelect;
