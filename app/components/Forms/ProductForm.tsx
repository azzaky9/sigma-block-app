import { useFormikContext, Field } from "formik";
import {
  TextField,
  Grid,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText
} from "@mui/material";
import { FormsCreateProduct, useLocationStore } from "@/lib/store";
import { TNestedItems } from "./CategoriesForm";
import { NumericFormatCustom } from "./Input/NumericFormatCustom";

export default function ProductForm() {
  const { location: locations } = useLocationStore();
  const { values, touched, isSubmitting, errors, handleChange } =
    useFormikContext<FormsCreateProduct & TNestedItems>();

  return (
    <div>
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
            disabled={isSubmitting}
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
              value={values.origin}
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
        {values.origin === "purchase" ? (
          <>
            <Grid
              item
              xs={6}
            >
              <TextField
                fullWidth
                required
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
    </div>
  );
}
