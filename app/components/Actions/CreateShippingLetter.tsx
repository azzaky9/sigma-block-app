import * as React from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  TextField,
  Typography,
  alpha
} from "@mui/material";
import LocationOn from "@mui/icons-material/LocationOn";
import { useCurrency } from "@/hooks/useCurrency";
import { useFormik } from "formik";
import {
  OrderTableData,
  OrderTableDocument,
  RequestLetterShipping
} from "@/types/types";
import { produce } from "immer";
import { shortenAlert } from "../Alert/alert";
import { useMutation } from "react-query";
import axios from "axios";
import { DocumentCreatedResponse } from "./GenerateInvoice";
// import { useSession } from "next-auth/react";

type Props = {
  amount: string;
  closeFn: () => void;
  defaultOrderData: OrderTableData;
};

type ChecklistState = {
  label: string;
  id: number;
};

type TForm = {
  priceWords: string;
  shippingTo: string;
};

type HashSelectedItem = Record<string, OrderTableDocument>;

export const RequiredForm = ({ amount, closeFn, defaultOrderData }: Props) => {
  const { products, customer, invoiceId, totalAmountsOrder } = defaultOrderData;

  const [checkListProduct, setCheckListProduct] = React.useState<
    OrderTableDocument[]
  >([]);
  const [hashSelected, setHashSelected] = React.useState<HashSelectedItem>({});
  const [isExceedLimit, setIsExceedLimit] = React.useState(false);

  const anchorElementRef = React.useRef<HTMLAnchorElement | null>(null);

  const session = useSession();
  const { numberToText, formatCurrency } = useCurrency();

  const { mutate, isLoading, isError } = useMutation({
    mutationKey: ["generate-letter"],
    mutationFn: async (formData: TForm) => {
      try {
        if (session.data?.user.name) {
          const url = process.env.NEXT_PUBLIC_INVOICE_GENERATOR_URL;
          const requestBody: RequestLetterShipping = {
            clientName: customer.fullName || "",
            admin: session.data.user.name,
            noInvoice: String(invoiceId),
            products: Object.entries(hashSelected).map(([key, value]) => ({
              ...value,
              id: key
            })),
            priceWords: formData.priceWords,
            shippingTo: formData.shippingTo,
            totalAmount: totalAmountsOrder
          };
          const response = await axios.post(
            `${url}invoice?dType=shipping`,
            requestBody
          );

          const data = response.data as DocumentCreatedResponse;

          if (!!anchorElementRef && anchorElementRef.current) {
            anchorElementRef.current.href = data.downloadedURL;
            anchorElementRef.current.click();
          }
        } else {
          throw new Error("Unauthorized please login.");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  });

  const removeHashItem = (hashSelected: HashSelectedItem, key: string) => {
    return produce(hashSelected, (draft) => {
      delete draft[key];
    });
  };

  const selectedLength = Object.keys(hashSelected).length;

  const handleCheckboxChange = (
    key: string,
    length: number,
    data: OrderTableDocument
  ) => {
    if (length >= 6) {
      shortenAlert("warning", "The product must not exceed the maximum limit");
      return setIsExceedLimit(true);
    }

    if (!hashSelected[key] && length < 6) {
      setHashSelected((prevState) => ({ ...prevState, [key]: data }));
    }

    if (hashSelected[key]) {
      setIsExceedLimit(false);
      setHashSelected((prevState) => removeHashItem(prevState, key));
    }
  };

  const numberToTextResult = React.useMemo(() => {
    const formatCurrencyToNumber = Number(
      amount.split("Rp")[1].trim().replace(".", "").trim()
    );
    return `${numberToText(formatCurrencyToNumber)
      .split(" ")
      .map((text) => `${text[0].toUpperCase()}${text.substring(1)}`)
      .join(" ")} Ribu Rupiah`;
  }, [amount]);

  const formik = useFormik<TForm>({
    initialValues: {
      priceWords: numberToTextResult,
      shippingTo: customer.address || ""
    },
    onSubmit: (values) => mutate(values)
  });

  const handleSubmit = () => {
    if (selectedLength === 0) {
      return shortenAlert("info", "Please select one product to deliver");
    }

    formik.handleSubmit();
  };

  React.useEffect(() => {
    const pushAndFormatProducToState = () => {
      const result: OrderTableDocument[] = [];

      products.forEach((ord) => {
        if (ord.orderCategory.length > 0) {
          return ord.orderCategory.forEach(
            ({ name, price, orderStock, id }) => {
              result.push({
                id: String(id),
                name,
                price: formatCurrency(price),
                qty: String(orderStock),
                subTotal: formatCurrency(orderStock * price)
              });
            }
          );
        }

        result.push({
          id: ord.productId,
          name: ord.name,
          price: formatCurrency(ord.price || 0),
          qty: String(ord.orderedQty || 0),
          subTotal: formatCurrency(ord.totalAmount)
        });
      });

      setCheckListProduct(result);
    };

    pushAndFormatProducToState();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        sx={{ width: "30vw" }}
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
          >
            <Chip
              size="small"
              color={
                selectedLength === 0
                  ? "default"
                  : !isExceedLimit
                  ? "info"
                  : "error"
              }
              variant="outlined"
              label="Total Shipping"
              sx={(theme) => ({
                mx: 2,
                mb: 1,
                bgcolor:
                  selectedLength > 0 ? alpha(theme.palette.info.main, 0.1) : ""
              })}
              avatar={
                <Avatar
                  sx={(theme) => ({
                    bgcolor:
                      selectedLength > 0
                        ? alpha(theme.palette.info.main, 0.1)
                        : ""
                  })}
                >
                  {selectedLength}
                </Avatar>
              }
            />
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Maximum 6 - 7 Barang
            </Typography>
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ height: "200px", overflowY: "scroll" }}
        >
          <FormGroup sx={{ mx: 4 }}>
            {checkListProduct.length > 0
              ? checkListProduct.map((data, index) => (
                  <FormControlLabel
                    key={index}
                    label={data.name}
                    control={
                      <Checkbox
                        checked={!!hashSelected[data.id]}
                        onChange={() =>
                          handleCheckboxChange(data.id, selectedLength, data)
                        }
                      />
                    }
                  />
                ))
              : null}
          </FormGroup>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Typography
            variant="h6"
            fontStyle="italic"
            color="text.secondary"
            sx={{ pl: 2 }}
          >
            {amount}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <TextField
            fullWidth
            name="priceWords"
            id="priceWords"
            value={formik.values.priceWords}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} // Ensure onBlur is handled for Formik validation
            maxRows={4}
            variant="outlined"
            helperText={
              formik.touched.priceWords && formik.errors.priceWords
                ? formik.errors.priceWords
                : "Cth: Tujuh Ratus Lima Puluh ...."
            }
            type="text"
            error={
              formik.touched.priceWords && Boolean(formik.errors.priceWords)
            } // Adding error handling
            label="Harga Terbilang dalam Tulisan"
          />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <TextField
            fullWidth
            name="shippingTo"
            id="shippingTo"
            variant="outlined"
            label="Tujuan"
            value={formik.values.shippingTo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.shippingTo && !!formik.errors.shippingTo}
            helperText={
              formik.touched.shippingTo && formik.errors.shippingTo
                ? formik.errors.shippingTo
                : ""
            }
            InputProps={{
              startAdornment: (
                <LocationOn
                  color="action"
                  sx={{ mr: 2 }}
                />
              )
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Stack sx={{ justifyContent: "end", alignItems: "end" }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              endIcon={isLoading && <CircularProgress size={16} />}
            >
              Submit
            </Button>
            <a
              ref={anchorElementRef}
              target="_blank"
              style={{ position: "absolute", opacity: 0 }}
            />
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};
