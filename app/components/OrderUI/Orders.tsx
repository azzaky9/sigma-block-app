import * as React from "react";
import {
  CategoryValue,
  InteractiveOrder,
  useGlobalControlOrder
} from "@/lib/store";
import Edit from "@mui/icons-material/Edit";
import Remove from "@mui/icons-material/Remove";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from "@mui/material";
import ControlCategory from "@/components/Actions/ControlCategory";
import FillPaymentInput from "@/components/Forms/FillPaymentInput";
import { useSearchParams } from "@remix-run/react";
import { shortenAlert } from "@/components/Alert/alert";
import { useCurrency } from "@/hooks/useCurrency";
import { produce } from "immer";
import { useDebounceCallback } from "usehooks-ts";

type TOP_ACTION_BAR_OPTION = "GLOBAL_EDIT" | "RESET" | string;

const Orders = () => {
  const {
    remove,
    order: orders,
    inc,
    dec,
    deletedRecord,
    ...anyStore
  } = useGlobalControlOrder();
  const { formatCurrency } = useCurrency();

  const [selectedBar, setSelectedBar] =
    React.useState<TOP_ACTION_BAR_OPTION>("");
  const [productIndex, setProductIndex] = React.useState<null | number>(null);
  const [currentCategory, setCurrentCategory] = React.useState<
    Record<string, CategoryValue>
  >(orders.length > 0 ? orders[0].categories : {});
  const [totalCategories, setTotalCategories] = React.useState<Record<
    string,
    number
  > | null>(null);

  const debounceIncrement = useDebounceCallback(inc, 160);
  const debounceDecrement = useDebounceCallback(dec, 160);

  const [params] = useSearchParams();
  const isEditMode = params.has("edit_order");

  const incrementQty = (id: string, currentValue: number) => {
    if (currentValue < currentCategory[id].maxOrder) {
      setCurrentCategory(
        produce((draft) => {
          draft[id].stock -= 1;
          draft[id].order_quantity += 1;
        })
      );

      debounceIncrement(
        { productId: productIndex ?? 1, categoryId: id },
        currentCategory[id].order_quantity + 1,
        isEditMode
      );
    }
  };

  const decrementQty = (id: string, currentValue: number) => {
    if (currentValue > 0) {
      setCurrentCategory(
        produce((draft) => {
          draft[id].stock += 1;
          draft[id].order_quantity -= 1;
        })
      );
      debounceDecrement(
        { productId: productIndex ?? 1, categoryId: id },
        currentCategory[id].order_quantity - 1,
        isEditMode
      );
    }
  };

  const calcTotalOrder = React.useMemo(() => {
    const findIndex = orders.find((ord) => ord.product_id === productIndex);
    let result = 0;

    if (!!findIndex) {
      const { categories } = findIndex;
      Object.entries(categories).forEach(([key, value]) => {
        result += value.order_quantity * value.price;
      });
    }

    return result;
  }, [productIndex, orders]);

  const handleToggling = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setSelectedBar(newAlignment);
  };

  const removeCategoryDbOrClient = (order: InteractiveOrder) => {
    if (isEditMode) {
      return remove(order.product_id, true, order.product_connection_id);
    }

    return remove(order.product_id);
  };

  React.useEffect(() => {
    if (!!productIndex) {
      const saveTotalAmount = (id: number, amount: number) => {
        const copiedPrevSavedTotalAmount = { ...totalCategories };
        copiedPrevSavedTotalAmount[id] = amount;
        setTotalCategories(copiedPrevSavedTotalAmount);
      };

      saveTotalAmount(productIndex, calcTotalOrder);
    }
  }, [calcTotalOrder, productIndex]);

  React.useEffect(() => {
    const insertDefaultSelected = () => {
      const firstOrderInIndex = orders[0];
      if (firstOrderInIndex) {
        setProductIndex(firstOrderInIndex.product_id);
        setCurrentCategory(firstOrderInIndex.categories);

        const mapSelected: Record<string, number> = {};

        orders.forEach((ord) => {
          mapSelected[ord.product_id] = 0;
        });
        setTotalCategories(mapSelected);
      }
    };

    insertDefaultSelected();
  }, []);

  if (orders.length === 0) {
    return (
      <Typography
        variant="body2"
        fontStyle="italic"
        color="text.secondary"
      >
        Tidak ada produk yang dipilih
      </Typography>
    );
  }

  return (
    <Box sx={{ pt: 1, pb: 4 }}>
      <Box
        sx={{
          mx: 3,
          mb: 1,
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        <Stack
          direction="row"
          sx={{ width: "100%" }}
          justifyContent="space-between"
        >
          <ToggleButtonGroup
            onChange={handleToggling}
            value={selectedBar}
            exclusive
            orientation="horizontal"
          >
            <Tooltip title="Global Edit">
              <ToggleButton
                color="primary"
                value="GLOBAL_EDIT"
              >
                <Edit />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Stack>
      </Box>
      <Grid
        container
        sx={{ width: "100%", px: 3 }}
        spacing={6}
      >
        <Grid
          item
          xs={7}
        >
          <List
            component="section"
            sx={{ height: 400, overflowY: "auto" }}
          >
            {orders.map((order, index) => (
              <ListItemButton
                disableRipple
                key={index}
                color="info"
                selected={order.product_id === productIndex}
                sx={{ mb: 1 }}
                onClick={() => {
                  setProductIndex(order.product_id);
                  setCurrentCategory(order.categories);
                }}
              >
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary={order.name} />
                {selectedBar === "GLOBAL_EDIT" ? (
                  <IconButton
                    onClick={() => {
                      if (orders.length === 1) {
                        return shortenAlert(
                          "warning",
                          "Order must be at least have one product."
                        );
                      }
                      removeCategoryDbOrClient(order);
                    }}
                  >
                    <Remove color="error" />
                  </IconButton>
                ) : null}
              </ListItemButton>
            ))}
          </List>
        </Grid>
        <Grid
          item
          xs={5}
        >
          <Card variant="outlined">
            <CardContent>
              <List
                component="section"
                aria-label="main mailbox folders"
                sx={{ height: 400, overflowY: "auto" }}
              >
                {currentCategory
                  ? Object.entries(currentCategory).map(
                      ([key, value], index) => (
                        <Box
                          key={index}
                          sx={{ mb: 2 }}
                        >
                          <ListItem
                            sx={{
                              display: "flex",
                              justifyContent: "space-between"
                            }}
                          >
                            <ListItemText
                              primary={value.name}
                              secondary={`Maksimal Pemesanan ${value.maxOrder}`}
                            />
                            <ListItemText
                              secondaryTypographyProps={{
                                sx: { textAlign: "end" }
                              }}
                              secondary={formatCurrency(value.price)}
                            />
                          </ListItem>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "end",
                              mr: 1
                            }}
                          >
                            <ControlCategory
                              ordered={value.order_quantity}
                              increment={() => {
                                if (productIndex) {
                                  incrementQty(key, value.order_quantity);
                                }
                              }}
                              decrement={() => {
                                if (productIndex) {
                                  decrementQty(key, value.order_quantity);
                                }
                              }}
                              max={value.maxOrder}
                              controlId={{
                                categoryId: key,
                                productId: productIndex ?? 0
                              }}
                            />
                          </Box>
                        </Box>
                      )
                    )
                  : null}
              </List>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Typography
                  sx={{ mx: 2, mt: 1 }}
                  fontStyle="italic"
                  color="text.secondary"
                  variant="body2"
                >
                  Total
                </Typography>
                <Typography sx={{ mt: 1, mr: 1, fontWeight: 600 }}>
                  {formatCurrency(calcTotalOrder)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <FillPaymentInput
            totalAmount={calcTotalOrder}
            savedCalculatingAmount={totalCategories ?? {}}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Orders;
