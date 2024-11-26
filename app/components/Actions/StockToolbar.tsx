import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import EditOutlined from "@mui/icons-material/EditOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

import AutocompleteLocation from "../Forms/AutocompleteLocation";

const StockCustomToolbar = () => {
  const actions = [
    { icon: <AddCircleOutline />, label: "Add" },
    { icon: <DeleteOutline />, label: "Delete" },
    { icon: <EditOutlined />, label: "Edit" },
    { icon: <SaveOutlined />, label: "Save" }
  ];
  return (
    <Stack direction="row">
      <AutocompleteLocation />
      <DatePicker
        views={["month", "year"]}
        slotProps={{
          // Targets the `IconButton` component.
          openPickerButton: {
            color: "primary"
          },
          // Targets the `InputAdornment` component.
          inputAdornment: {
            position: "start"
          },

          textField: {
            sx: () => ({
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none"
                }
              }
            })
          }
        }}
        slots={{ openPickerIcon: ArrowDropDown, field: () => null }}
      />
    </Stack>
  );
};

export default StockCustomToolbar;
