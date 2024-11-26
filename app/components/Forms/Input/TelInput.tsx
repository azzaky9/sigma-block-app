import * as React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { PatternFormat, NumericFormatProps } from "react-number-format";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

// Custom formatter component
const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <PatternFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value
            }
          });
        }}
        format="+62 ### ### ####"
        mask="_"
        allowEmptyFormatting
      />
    );
  }
);

interface TelInputProps extends Omit<TextFieldProps, "onChange"> {
  onChange?: (value: string) => void;
  value?: string;
}

export default function TelInput({ onChange, value, ...props }: TelInputProps) {
  const handleChange = (event: { target: { value: string } }) => {
    onChange?.(event.target.value);
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      slotProps={{
        input: {
          inputComponent: NumericFormatCustom as any
        }
      }}
      fullWidth
      variant="outlined"
    />
  );
}
