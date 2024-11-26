import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { trpc } from "@/utils/trpc-client";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useLocationStore } from "@/lib/store";
import PushPin from "@mui/icons-material/PushPin";

const AutocompleteLocation = () => {
  const utils = trpc.useUtils();

  const setLocation = useLocationStore((state) => state.set);
  const setGlobalSelected = useLocationStore(
    (state) => state.setSelectedLocation
  );
  const { data, isLoading, isError } = trpc.getExisitingLocation.useQuery();

  const [value, setValue] = React.useState<string | null>("Storage");
  const [inputValue, setInputValue] = React.useState("");

  const options = React.useMemo(() => {
    return data ? data.map((d) => d.location_name) : [];
  }, [data]);

  React.useEffect(() => {
    setLocation(options);
  }, [options]);

  return (
    <Autocomplete
      id="size-small-outlined-multi"
      options={options}
      getOptionLabel={(option) => option}
      value={value}
      onChange={(event: any, newValue: string | null) => {
        setValue(newValue);
        setGlobalSelected(newValue ?? "");

        utils.getProducts.invalidate();
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      loading={isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          error={isError}
          placeholder="Provide Location"
          sx={{
            minWidth: "200px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none"
              }
            }
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <PushPin sx={{ fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <React.Fragment>
                {isLoading ? (
                  <CircularProgress
                    color="inherit"
                    size={20}
                  />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
};

export default React.memo(AutocompleteLocation);
