import * as React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import BaseModalChildren from "./BaseModalChildren";
import { useLocationStore, useTransferStock } from "@/lib/store";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import Remove from "@mui/icons-material/Remove";
import Send from "@mui/icons-material/Send";
import {
  ButtonGroup,
  CircularProgress,
  IconButton,
  ListItem,
  Tooltip,
  Typography,
  Box,
  Stack,
  alpha
} from "@mui/material";
import { trpc } from "@/utils/trpc-client";
import { enqueueSnackbar } from "notistack";
import DisplayDestination from "../Indicators/DisplayDestination";

type List = {
  id: number;
  header: string;
  subHeader?: string;
  qty: number;
};

type EditableStock = {
  [key: string]: number;
};

export default function TransferList() {
  const productId = useTransferStock((state) => state.id);
  const setProductId = useTransferStock((state) => state.setId);
  const setSelectedLocation = useLocationStore(
    (state) => state.setSelectedLocation
  );
  const currentLocation = useLocationStore((state) => state.selectedLocation);

  const [transferredTo, setTransferredTo] = React.useState("");
  const [editableStock, setEditableStock] =
    React.useState<EditableStock | null>(null);

  const utils = trpc.useUtils();
  const {
    isError: isTransferError,
    isLoading: isTransferLoading,
    mutateAsync: transferMutation
  } = trpc.transferProduct.useMutation({
    onSuccess: () => {
      setProductId(null);

      enqueueSnackbar({
        variant: "success",
        message: "success to transfer product"
      });

      setSelectedLocation("Storage");

      utils.getProductById.invalidate();
      utils.getProducts.invalidate();
    },
    onError: (err) => {
      enqueueSnackbar({
        variant: "error",
        message: "error during transfer, try again later.."
      });

      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  });
  const { data, isError, isLoading } = trpc.getProductById.useQuery(
    {
      location: currentLocation,
      id: productId ?? 1
    },
    { enabled: !!productId }
  );

  const results = React.useMemo((): List[] => {
    if (data) {
      return data.category.map((ctg) => ({
        id: ctg.id,
        header: ctg.name,
        subHeader: `Max: ${ctg.stock}`,
        qty: ctg.stock || 0
      }));
    }

    return [];
  }, [data]);

  const handleClose = () => {
    setTransferredTo("");
    setProductId(null);
  };

  const inc = (id: string, max: number) => {
    if (editableStock && editableStock[id] !== max) {
      setEditableStock((prev) => ({
        ...prev,
        [id]: prev ? (prev[id] += 1) : 0
      }));
    }
  };
  const dec = (id: string) => {
    if (editableStock && editableStock[id] !== 0) {
      setEditableStock((prev) => ({
        ...prev,
        [id]: prev ? (prev[id] -= 1) : 0
      }));
    }
  };

  const handleTransfer = async () => {
    if (!!transferredTo && productId && data && editableStock) {
      await transferMutation({
        fromLocation: currentLocation,
        toLocation: transferredTo,
        // product id
        id: productId,

        // change this later
        previousStock: data.category.map((ctg) => ({
          ...ctg,
          // git --push purpose!
          price: ctg.price,
          stock: ctg.stock || 0
        })),
        transferStock: data.category.map((ctg) => ({
          ...ctg,
          // git --push purpose!
          price: ctg.price,
          stock: editableStock[ctg.id]
        }))
      });
    }

    if (!productId) {
      return enqueueSnackbar({
        variant: "error",
        message: "cannot do this action, provide a valid id."
      });
    }

    if (!transferredTo) {
      return enqueueSnackbar({
        message: "Provide destinations",
        variant: "error"
      });
    }
  };
  // const handleItemClick = (location: string) => setTransferredTo(location);

  React.useEffect(() => {
    if (data) {
      const hashQty: { [key: string]: number } = {};

      data.category.forEach((ctg) => {
        hashQty[String(ctg.id)] = 0;
      });

      setEditableStock(hashQty);
    }
  }, [data]);

  React.useEffect(() => {
    if (isError) {
      enqueueSnackbar({
        message: "Something went wrong, try again later.",
        variant: "error"
      });
    }
  }, [isError]);

  return (
    <BaseModalChildren
      isOpen={!!productId}
      actions={
        <Stack
          flexDirection="row"
          gap={1.2}
        >
          <Button
            onClick={handleTransfer}
            variant="contained"
            color="secondary"
            endIcon={
              isTransferLoading ? <CircularProgress size={16} /> : <Send />
            }
          >
            Transfer
          </Button>
        </Stack>
      }
      title={
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">Transfer Stock</Typography>
          <Tooltip title="Close">
            <IconButton
              color="error"
              onClick={handleClose}
            >
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <Typography variant="h6">{data?.name}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "none",
          gap: 1.2
        }}
      >
        <Box sx={{ height: 460 }}>
          {isLoading ? (
            <CircularProgress size={19} />
          ) : (
            <>
              <Box>
                <List
                  sx={(theme) => ({
                    height: 300,
                    overflow: "auto",
                    overflowY: "scroll",
                    "&::-webkit-scrollbar": {
                      width: "8px" // width of the scrollbar
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: alpha(theme.palette.secondary.main, 0.3), // color of the scrollbar handle
                      borderRadius: "5px" // roundness of the scrollbar handle
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: theme.palette.primary.main // color of the scrollbar handle on hover
                    }
                  })}
                >
                  {!!editableStock &&
                    results.map(({ header, subHeader, id, qty }, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={header}
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between"
                              }}
                            >
                              <Typography variant="subtitle2">
                                {subHeader}
                              </Typography>
                              <ButtonGroup
                                variant="text"
                                size="small"
                              >
                                <Button onClick={() => inc(String(id), qty)}>
                                  <Add
                                    sx={(theme) => ({
                                      fontSize: 16,
                                      color: theme.palette.primary.main
                                    })}
                                  />
                                </Button>
                                <Button>{editableStock[id]}</Button>
                                <Button onClick={() => dec(String(id))}>
                                  <Remove
                                    sx={(theme) => ({
                                      fontSize: 16,
                                      color: theme.palette.primary.main
                                    })}
                                  />
                                </Button>
                              </ButtonGroup>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                </List>
                <DisplayDestination
                  currentLocation={currentLocation}
                  setCurrentLocation={setTransferredTo}
                  destinations={[
                    { label: currentLocation },
                    { label: transferredTo }
                  ]}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </BaseModalChildren>
  );
}
