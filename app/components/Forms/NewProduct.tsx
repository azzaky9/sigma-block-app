import * as React from "react";

import _ from "lodash";
import { useSnackbar } from "notistack";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Field, Form, FormikProvider, useFormik } from "formik";
import { NumericFormat, NumericFormatProps } from "react-number-format";

import { Category } from "@/types/types";
import Add from "@mui/icons-material/Add";
import { trpc } from "@/utils/trpc-client";
import { useSearchParams } from "@remix-run/react";
import type { FormsCreateProduct } from "@/lib/store";
import { useInputCategory, useLocationStore } from "@/lib/store";
import {
  CreateProduct
  // type VTCreateProduct as P
} from "@/server/validation/base";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";

// type WithoutCategories = Omit<P, "category">;

const initialValues: FormsCreateProduct = {
  name: "",
  amountSupplier: "",
  amount: "",
  stock: 0,
  location: "Storage",
  supplier: "",
  origin: "purchase"
};

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export const NumericFormatCustom = React.forwardRef<
  NumericFormatProps,
  CustomProps
>(function NumericFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
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
      thousandSeparator
      valueIsNumericString
      prefix="Rp"
    />
  );
});

type Props = {
  closeFn: () => void;
  defaultValues: FormsCreateProduct;
};

export default function NewProductForms({ closeFn, defaultValues }: Props) {
  const utils = trpc.useUtils();

  const categories = useInputCategory((state) => state.categories);
  const add = useInputCategory((state) => state.add);
  const cleanup = useInputCategory((state) => state.cleanup);
  const locations = useLocationStore((state) => state.location);
  const deletedRecord = useInputCategory((state) => state.deletedRecord);

  const [params] = useSearchParams();

  const isEditProduct = params.has("editor_open");
  const isCategoryEmpty = categories.length === 0;

  const { enqueueSnackbar: fireToast } = useSnackbar();

  const [newStock, setNewStock] = React.useState<string>("");

  // const handleNewStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewStock(e.target.value as string);
  // };

  const successAction = () => {
    closeFn();
    cleanup();
    fireToast({
      variant: "success",
      message: "success to create products",
      anchorOrigin: {
        horizontal: "right",
        vertical: "bottom"
      },
      autoHideDuration: 1200
    });

    utils.getProductById.invalidate();
    utils.getProducts.refetch();
  };

  // add id for update the product, for create you dont need to add the id!.
  const { mutateAsync: updateMutation, isLoading: isUpdateLoading } =
    trpc.updateProduct.useMutation({
      onSuccess: () => successAction(),
      onError: (err) => console.error(err.message)
    });
  const { mutateAsync: createMutation, isLoading: isCreateLoading } =
    trpc.createProduct.useMutation({
      onSuccess: () => successAction(),
      onError: (err) => console.error(err.message)
    });

  const formik = useFormik<FormsCreateProduct>({
    onSubmit: async (value) => {
      if (isEditProduct && value.id) {
        return await updateMutation({
          ...value,
          id: value.id,
          locationName: value.location,
          category: categories
            .map((c) => ({
              id: Number(c.id),
              name: c.name,
              price: c.price,
              stock: c.stock,
              stockId: c.stockId,
              stockLocationId: Number(c.specificIdAtSelectedLocation || 0)
            }))
            .filter((c) => !!c.stockId && !!c.stockLocationId),
          deletedRecord: deletedRecord,
          newRecord: categories.filter((c) => c.types === "edit")
        });
      }
      await createMutation({ ...value, category: categories });
    },
    initialValues: initialValues,
    validationSchema: toFormikValidationSchema(
      CreateProduct.omit({ category: true })
    )
  });

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldValue
    // isValid
  } = formik;

  const handleAdd = () => {
    const initial: Omit<Category, "product_id"> = {
      id: `code-${Math.floor(Math.random() * 9999)}`,
      name: newStock,
      stock: 1,
      price: 0,
      types: isEditProduct ? "edit" : undefined
    };
    add(initial);
    setNewStock("");
    setFieldValue("amount", "");
  };

  const isDefaultAndFormSame = (): boolean => {
    if (isEditProduct) {
      const result = _.isEqual(defaultValues, formik.values);

      return result;
    }

    return true;
  };

  isDefaultAndFormSame();

  const isProductPurchasing = values.origin === "purchase";

  React.useEffect(() => {
    if (!isCategoryEmpty) {
      setFieldValue("stock", 0);
    }
  }, [categories]);

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <Grid
          container
          sx={{ mt: 4 }}
          rowSpacing={1}
          columnSpacing={2}
        >
          <Grid
            item
            xs={6}
          >
            <Field
              required
              as={TextField}
              disabled={isCreateLoading}
              variant="outlined"
              size="small"
              name="name"
              label="Nama Produk"
              error={touched.name && Boolean(errors.name)}
              helperText={errors.name ? errors.name : "\u2000"}
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <FormControl
              variant="outlined"
              size="small"
              sx={{ width: "100%" }}
            >
              <InputLabel id="demo-simple-select-filled-label">
                Tipe Barang
              </InputLabel>
              <Select
                name="origin"
                value={formik.values.origin}
                onChange={handleChange}
              >
                <MenuItem
                  disabled
                  value=""
                >
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"purchase"}>Supplier</MenuItem>
                <MenuItem value={"production"}>Produksi</MenuItem>
              </Select>
              {touched.origin && errors.origin ? (
                <FormHelperText>{errors.origin}</FormHelperText>
              ) : null}
            </FormControl>
          </Grid>
          {isProductPurchasing ? (
            <>
              <Grid
                item
                xs={6}
              >
                <TextField
                  fullWidth
                  required
                  disabled={isCreateLoading}
                  name="amountSupplier"
                  label="Modal"
                  value={values.amountSupplier}
                  onChange={handleChange}
                  id="formatted-numberformat-input"
                  InputProps={{
                    inputComponent: NumericFormatCustom as any,
                    spellCheck: false
                  }}
                  error={touched.amountSupplier && !!errors.amountSupplier}
                  helperText={
                    errors.amountSupplier ? errors.amountSupplier : "\u2000"
                  }
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid
                item
                xs={6}
              >
                <TextField
                  fullWidth
                  required
                  disabled={isCreateLoading}
                  name="supplier"
                  label="Pemasok"
                  value={values.supplier}
                  onChange={handleChange}
                  error={touched.supplier && !!errors.supplier}
                  helperText={errors.supplier}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid
                item
                xs={6}
              >
                <TextField
                  fullWidth
                  required
                  disabled={isCreateLoading}
                  name="amountSupplier"
                  label="Biaya Produksi"
                  value={values.amountSupplier}
                  onChange={handleChange}
                  id="formatted-numberformat-input"
                  InputProps={{
                    inputComponent: NumericFormatCustom as any,
                    spellCheck: false
                  }}
                  error={touched.amountSupplier && !!errors.amountSupplier}
                  helperText={
                    errors.amountSupplier ? errors.amountSupplier : "\u2000"
                  }
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid
                item
                xs={6}
              >
                <TextField
                  fullWidth
                  required
                  disabled={isCreateLoading}
                  name="supplier"
                  label="Penanggung Jawab"
                  value={values.supplier}
                  onChange={handleChange}
                  error={touched.supplier && !!errors.supplier}
                  helperText={errors.supplier}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </>
          )}
          <Grid
            item
            xs={6}
          >
            <TextField
              disabled={isCreateLoading || !isCategoryEmpty}
              variant="outlined"
              size="small"
              name="amount"
              required
              label="Harga Jual"
              value={values.amount}
              onChange={handleChange}
              InputProps={{
                inputComponent: NumericFormatCustom as any,
                spellCheck: false
              }}
              error={touched.amount && Boolean(errors.amount)}
              helperText={errors.amount ? errors.amount : "\u2000"}
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <Field
              as={TextField}
              variant="outlined"
              size="small"
              type="number"
              name="stock"
              label="Total Persediaan (Stock)"
              disabled={!isCategoryEmpty || isCreateLoading}
              error={touched.stock && Boolean(errors.stock)}
              helperText={errors.stock}
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <Field
              as={TextField}
              variant="outlined"
              size="small"
              select
              disabled={isCreateLoading || isEditProduct}
              name="location"
              required
              label="Penempatan Persediaan"
              value={values.location}
              onChange={handleChange}
              fullWidth
            >
              {locations.map((location) => (
                <MenuItem
                  key={location}
                  value={location}
                >
                  {location}
                </MenuItem>
              ))}
            </Field>
          </Grid>
        </Grid>
        <Box
          sx={{
            widht: "100%",
            display: "flex",
            alignSelf: "end",
            justifyContent: "end",
            gap: 2,
            mt: 4
          }}
        >
          <Button
            sx={{ mt: 4 }}
            variant="outlined"
            color="secondary"
            size="small"
            endIcon={<Add />}
            onClick={handleAdd}
          >
            Tambah Kategori
          </Button>
          <Button
            sx={{ mt: 4 }}
            variant="contained"
            color="primary"
            size="medium"
            type="submit"
            endIcon={
              isCreateLoading || isUpdateLoading ? (
                <CircularProgress
                  color="secondary"
                  size={14}
                />
              ) : undefined
            }
          >
            Simpan
          </Button>
        </Box>
      </Form>
    </FormikProvider>
  );
}
