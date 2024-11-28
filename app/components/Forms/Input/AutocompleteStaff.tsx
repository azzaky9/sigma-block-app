import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function AutocompleteStaff() {
  const [inputValue, setInputValue] = React.useState("");

  const [staffOptions] = React.useState<{ name: string }[]>([]);
  const [selectedStaff, setSelectedStaff] = React.useState<{ name: string }[]>(
    []
  );

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const processName = (newValueName: string) => {
    if (!newValueName.includes("Tambahkan")) {
      return {
        name: capitalizeWords(newValueName)
      };
    }
    const sampleArray = newValueName.replace(/Tambahkan/g, "").split("");
    const onlyAbjad = sampleArray.filter((char) => /^[a-zA-Z\s]$/.test(char));
    return {
      name: capitalizeWords(onlyAbjad.join(""))
    };
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      size="small"
      options={staffOptions}
      getOptionLabel={(option) =>
        typeof option !== "string" ? option.name : option
      }
      value={selectedStaff}
      isOptionEqualToValue={(option, value) => {
        const optionTitle = typeof option === "string" ? option : option.name;
        const valueTitle = typeof value === "string" ? value : value.name;
        return optionTitle === valueTitle;
      }}
      onChange={(e, newValue) => {
        const result = newValue.map((staff) =>
          processName((staff as { name: string }).name)
        );
        setSelectedStaff(result);
      }}
      inputValue={inputValue}
      onInputChange={(event, newValue) => {
        console.log("new input value", newValue);
        setInputValue(newValue);
      }}
      filterOptions={(options) => {
        const filtered = options.filter((option) =>
          option.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            name: "Tambahkan " + `"${inputValue}"`
          });
        }

        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Select Staff"
          placeholder="Add staff"
        />
      )}
    />
  );
}
