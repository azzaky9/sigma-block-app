import * as React from "react";
import {
  Autocomplete,
  ListSubheader,
  List,
  ListItem,
  ListItemText,
  TextField
} from "@mui/material";
import { CustomerResponse } from "@/server/controller/customer-controller";
import { useDebounceCallback } from "usehooks-ts";
import { trpc } from "@/utils/trpc-client";

type Props = {
  onClear: () => void;
  onSelect: (newValue: CustomerResponse) => void;
};

export default function PreviouseCustomer({ onClear, onSelect }: Props) {
  const [searchCustomer, setSearchCustomer] = React.useState("");
  const debounceCustomerSearch = useDebounceCallback(setSearchCustomer, 300);

  const { data: resultCustomer, isLoading: isSearchCsLoading } =
    trpc.findPreviouseCustomer.useQuery(searchCustomer, {
      enabled: !!searchCustomer
    });

  return (
    <Autocomplete
      freeSolo
      options={resultCustomer || []}
      onChange={(_, newValue, reason) => {
        if (reason === "clear") {
          return onClear();
        }
        if (newValue && typeof newValue !== "string") {
          onSelect(newValue);
        }
      }}
      getOptionLabel={(option) => option.name}
      loading={isSearchCsLoading}
      ListboxComponent={({ children, ...other }) => (
        <div>
          <ListSubheader>Previouse Customer</ListSubheader>
          <List {...other}>{children}</List>
        </div>
      )}
      renderOption={(props, option) => (
        <ListItem {...props}>
          <ListItemText primary={option.name} />
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Customer Name"
          variant="outlined"
          onChange={(e) => debounceCustomerSearch(e.target.value)}
          InputProps={{
            ...params.InputProps
          }}
        />
      )}
    />
  );
}
