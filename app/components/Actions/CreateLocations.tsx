import * as React from "react";
import AddLocationAlt from "@mui/icons-material/AddLocationAlt";
import BaseModalChildren from "../Modal/BaseModalChildren";
import { useBoolean } from "usehooks-ts";
import { Button, CircularProgress, TextField } from "@mui/material";
import { trpc } from "@/utils/trpc-client";
import { enqueueSnackbar } from "notistack";

type ErrorState = {
  isError: boolean;
  message: string;
};

export const capitalize = (value: string) => {
  const splitStr = value.split(" ");

  return splitStr
    .map(
      (str) => `${str.at(0)?.toUpperCase()}${str.substring(1).toLowerCase()}`
    )
    .join(" ");
};

export default function CreateLocations() {
  const trpcUtils = trpc.useUtils();
  const { mutate, isLoading } = trpc.createLocations.useMutation({
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Complete to add new Location"
      });

      trpcUtils.getExisitingLocation.invalidate();
    },
    onError: () => {
      enqueueSnackbar({
        variant: "error",
        message: "Error during add new Location, try again later.."
      });
    }
  });

  const {
    value: isOpen,
    setFalse: handleClose,
    setTrue: handleOpen
  } = useBoolean();

  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState<ErrorState>({
    isError: false,
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as string);
  };
  const handleSubmit = () => {
    if (!value) {
      return setError({ isError: true, message: "Location name is required" });
    }

    mutate({ name: capitalize(value) });
  };

  const cleanup = () => {
    setValue("");

    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        sx={{ mr: 1 }}
        onClick={handleOpen}
        endIcon={<AddLocationAlt fontSize="small" />}
      >
        Lokasi Baru
      </Button>
      <BaseModalChildren
        isOpen={isOpen}
        onClose={cleanup}
        onOpen={handleOpen}
        title={"Lokasi"}
        actions={
          <Button
            onClick={handleSubmit}
            variant="contained"
            endIcon={
              isLoading ? (
                <CircularProgress
                  color="secondary"
                  size={16}
                />
              ) : (
                <div />
              )
            }
          >
            Create
          </Button>
        }
      >
        <div className="p-3">
          <TextField
            fullWidth
            sx={{ mt: 2, mb: 1 }}
            label="Location Name"
            required
            variant="outlined"
            size="small"
            placeholder="Type here.."
            value={value}
            error={error.isError}
            helperText={error.message}
            onChange={handleChange}
          />
        </div>
      </BaseModalChildren>
    </>
  );
}
