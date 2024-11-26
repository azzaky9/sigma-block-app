import * as React from "react";
import { useFormik } from "formik";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import PercentOutlined from "@mui/icons-material/PercentOutlined";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import { CurrencysInput } from "@/components/Alert/Input/CurrencysInput";
import {
  GlobalInformationPayment,
  useFormOrderControlStore
} from "@/lib/zustand/store/formOrderStore";
import { InteractiveOrder, useGlobalControlOrder } from "@/lib/store";
import BaseModalChildren from "@/components/Modal/BaseModalChildren";
import ReviewProduct from "@/components/ModalContent/ReviewProduct";
import { useBoolean } from "usehooks-ts";
import { trpc } from "@/utils/trpc-client";
import { shortenAlert } from "@/components/Alert/alert";
import { useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import { Form as CustomerFormStruct } from "./CreateOrderForm";

export type Form = {
  invoiceNumber: number;
  paymentMethod: string;
  priceVariant: "custom" | "auto";
  customPayment: "";
  tax: string;
  disc: string;
};

type Props = {
  totalAmount: number;
  savedCalculatingAmount: Record<string, number>;
};

type MakeOrderArgument = {
  formData: Form;
  customerData: CustomerFormStruct;
  order: InteractiveOrder[];
};

const FillPaymentInput = ({ totalAmount, savedCalculatingAmount }: Props) => {
  const globalOrderRecap = useGlobalControlOrder();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const utils = trpc.useUtils();
  const { setFormData } = useFormOrderControlStore();
  const { mutate: createOrder, isLoading } = trpc.createOrder.useMutation({
    onSuccess: () => {
      shortenAlert("success", "Order complete to create");

      utils.getOrders.invalidate();
    },
    onError: (err) => {
      if (err instanceof Error) {
        console.error(err.message);
      }

      shortenAlert("error", "Error during creating try again later.");
    }
  });
  const { mutate: updateEditOrder, isLoading: isUpdateEdittingDataLoad } =
    trpc.editOrder.useMutation({
      onSuccess: () => {
        shortenAlert("success", "Order success to edit.");

        utils.getOrders.invalidate();
        utils.searchProduct.invalidate();
      },
      onError: (err) => {
        if (err instanceof Error) {
          console.error(err.message);
        }

        shortenAlert("error", "Error during creating try again later.");
      }
    });

  const resultAmount = React.useMemo(() => {
    return Object.values(savedCalculatingAmount).reduce(
      (total, amount) => total + amount,
      0
    );
  }, [savedCalculatingAmount]);

  const {
    value: isReviewOpen,
    setFalse: closeReview,
    setTrue: openReview
  } = useBoolean();

  const formik = useFormik<Form>({
    initialValues: {
      invoiceNumber: 1,
      paymentMethod: globalOrderRecap.customerData
        ? globalOrderRecap.customerData.paymentMethod
        : "Cash",
      priceVariant: "auto",
      customPayment: "",
      tax: "11",
      disc: "0"
    },
    // Base Submit if not edit mode.
    onSubmit: (values) => {
      const { customerData, order } = globalOrderRecap;
      const orderId = params.has("edit_order");

      if (customerData && order.length > 0) {
        if (orderId) {
          updateEdittingOrder(values);
          return navigate(pathName, { preventScrollReset: false });
        }

        createNewOrder(values);
      } else {
        shortenAlert("warning", "Invalid processing data");
        shortenAlert(
          "info",
          "TIP: You can try to close this modal and create again."
        );
      }
    }
  });

  function updateEdittingOrder(formData: Form) {
    const { customerData, order, deletedRecord } = globalOrderRecap;
    const orderId = params.get("edit_order");

    if (customerData && !!orderId) {
      updateEditOrder({
        ...makeInsertedData({ customerData, formData, order }),
        id: orderId,
        newRecord: order
          .filter((ord) => ord.type === "new-record")
          .map((ord) => {
            const formatCategories = Object.entries(ord.categories).map(
              ([, value]) => {
                return {
                  category_id: Number(value.categoryStockInSpecificLocationId),
                  from_location: value.from_location,
                  order_quantity: value.order_quantity
                };
              }
            );

            return { ...ord, categories: formatCategories };
          }),
        deletedRecord,
        invoiceId: customerData.invoiceId
      });
    }
  }

  function makeInsertedData({ customerData, order }: MakeOrderArgument) {
    const taxAmount = (totalAmount * Number(values.tax)) / 100;
    const discAmount = (totalAmount * Number(values.disc)) / 100;
    const result = resultAmount - discAmount + taxAmount;
    // const isEditMode = params.has("edit_order");

    return {
      customerId: customerData.customerId,
      full_name: customerData!.full_name,
      company: customerData.company,
      amount: result,
      orders: order
        .filter((ord) => ord.type === "original" || !ord.type)
        .map(({ product_id, categories, product_connection_id }) => {
          const formattedCategories = Object.entries(categories).map(
            ([, value]) => ({
              category_id: Number(value.categoryStockInSpecificLocationId),
              from_location: value.from_location,
              order_quantity: value.order_quantity,
              stock: value.stock
            })
          );

          return {
            product_id,
            product_connection_id,
            total_amount: savedCalculatingAmount[product_id] || 0,
            categories: formattedCategories
          };
        }),
      paymentInfo: {
        taxAmount,
        taxPercent: +values.tax,
        discAmount,
        discPercent: +values.disc
      },
      paymentMethod:
        values.paymentMethod.toLowerCase() === "custom"
          ? values.customPayment
          : values.paymentMethod,
      priceVariant: values.priceVariant,

      phone: customerData!.phone,
      email: customerData!.email,
      address: customerData!.address
    };
  }

  function createNewOrder(formData: Form) {
    const { customerData, order } = globalOrderRecap;

    if (customerData) {
      createOrder(makeInsertedData({ customerData, formData, order }));
    }
  }

  const { values } = formik;

  const payments = ["Cash", "Debit", "Custom"];
  // const pricesType = ["Eceran", "Project", "Toko"];

  const openReviewCallback = React.useCallback(() => {
    handleOpenReview({ ...values, totalAmount });
  }, [values, totalAmount]);

  const handleOpenReview = (orderInfo: GlobalInformationPayment) => {
    setFormData(orderInfo);
    openReview();
  };

  const isPaymentMethodCustom =
    formik.values.paymentMethod.toLowerCase() === "custom";

  const renderReviewProduct = (
    <BaseModalChildren
      isOpen={isReviewOpen}
      minWidth={450}
      title="Review Produk"
      actions={
        <Stack direction={"row"}>
          <Button onClick={closeReview}>Tutup</Button>
        </Stack>
      }
    >
      <ReviewProduct totalAmount={resultAmount} />
    </BaseModalChildren>
  );

  const isEditOrder = !!params.get("edit_order");

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h5"
        sx={{ ml: 2, mb: 2 }}
      >
        Pembayaran
      </Typography>
      <Divider />
      <Box sx={{ mt: 2 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            sx={{ px: 2 }}
            spacing={2}
          >
            <Grid
              item
              xs={4}
            >
              <TextField
                disabled={isUpdateEdittingDataLoad || isLoading}
                fullWidth
                id="invoiceNumber"
                name="invoiceNumber"
                label="Nomor Invoice"
                type="text"
                required
                onChange={formik.handleChange}
                value={formik.values.invoiceNumber}
              />
            </Grid>
            <Grid
              item
              xs={4}
            >
              <Autocomplete
                id="paymentMethod"
                options={payments}
                disableClearable
                value={formik.values.paymentMethod}
                onChange={(event, newValue) => {
                  formik.setFieldValue("paymentMethod", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    disabled={isUpdateEdittingDataLoad || isLoading}
                    fullWidth
                    label="Metode Pembayaran"
                    variant="outlined"
                    name="paymentMethod"
                  />
                )}
              />
            </Grid>
            {isPaymentMethodCustom && (
              <Grid
                item
                xs={4}
              >
                <TextField
                  disabled={isUpdateEdittingDataLoad || isLoading}
                  fullWidth
                  required
                  id="customPayment"
                  name="customPayment"
                  value={formik.values.customPayment}
                  onChange={formik.handleChange}
                  label="Kustomisasi Pembayaran"
                  variant="outlined"
                />
              </Grid>
            )}

            <Grid
              item
              xs={4}
            >
              <TextField
                disabled={isUpdateEdittingDataLoad || isLoading}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <PercentOutlined
                      sx={{ mr: 2, fontSize: 16, color: "text.secondary" }}
                    />
                  )
                }}
                type="number"
                id="tax"
                name="tax"
                label="Pajak / PPN"
                onChange={formik.handleChange}
                value={formik.values.tax}
              />
            </Grid>
            <Grid
              item
              xs={4}
            >
              <TextField
                disabled={isUpdateEdittingDataLoad || isLoading}
                fullWidth
                type="number"
                id="disc"
                name="disc"
                label="Diskon"
                onChange={formik.handleChange}
                value={formik.values.disc}
              />
            </Grid>
            <Grid
              item
              xs={4}
            >
              <TextField
                disabled={isUpdateEdittingDataLoad || isLoading}
                label="Harga Total"
                autoCorrect="off"
                value={resultAmount}
                // onChange={handleChange}
                fullWidth
                name="numberformat"
                InputProps={{
                  inputComponent: CurrencysInput as any
                }}
              />
            </Grid>
          </Grid>
        </form>
        <Box sx={{ display: "flex", mt: 4, justifyContent: "end" }}>
          <Button
            endIcon={<RemoveRedEye />}
            variant="contained"
            onClick={openReviewCallback}
          >
            Review
          </Button>
          <Button
            sx={{ ml: 2 }}
            variant="outlined"
            color={!isEditOrder ? "primary" : "success"}
            type="submit"
            endIcon={
              isLoading || isUpdateEdittingDataLoad ? (
                <CircularProgress size={12} />
              ) : undefined
            }
            onClick={() => formik.handleSubmit()}
          >
            {!isEditOrder ? "Simpan" : "Simpan Perubahan"}
          </Button>
          {renderReviewProduct}
        </Box>
      </Box>
    </Box>
  );
};

export default FillPaymentInput;
