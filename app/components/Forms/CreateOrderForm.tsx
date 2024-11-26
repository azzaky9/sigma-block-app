import * as React from "react";

import * as z from "zod";
import { useFormik } from "formik";
import TelInput from "@/components/Forms/Input/TelInput";
import { useBoolean, useDebounceCallback } from "usehooks-ts";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { trpc } from "@/utils/trpc-client";
import Search from "@mui/icons-material/Search";
import { useSearchParams } from "@remix-run/react";
import { useGlobalControlOrder } from "@/lib/store";
import { shortenAlert } from "@/components/Alert/alert";
import ProductCard from "@/components/OrderUI/ProductCard";
import NavigateNext from "@mui/icons-material/NavigateNext";
import { createOrderValidation } from "@/server/validation/base";
import { CustomerResponse } from "@/server/controller/customer-controller";
import PreviouseCustomer from "@/components/Alert/Input/PreviouseCustomer";
import { useLocation as useLocationContext } from "@/context/LocationProvider";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography
} from "@mui/material";

type TCreateOrder = z.infer<typeof createOrderValidation>;
export interface Form extends Omit<TCreateOrder, "orders"> {
  customerId: string;
  invoiceId?: number;
}

type Props = {
  openConfirmationNextHandler: () => void;
  editDefaultData?: Form;
};

const CreateOrderForm = ({
  openConfirmationNextHandler,
  editDefaultData
}: Props) => {
  const { locations, loading, error } = useLocationContext();
  const { order, customerData, setCustomerData } = useGlobalControlOrder();

  const [params] = useSearchParams();

  const formik = useFormik<Form>({
    initialValues: editDefaultData
      ? editDefaultData
      : customerData
      ? customerData
      : ({} as Form),
    validationSchema: toFormikValidationSchema(
      createOrderValidation.omit({ orders: true })
    ),
    onSubmit: (value) => {
      openConfirmationNextHandler();
      return setCustomerData({
        ...value,
        customerId: value.customerId
      });
    }
  });

  const { value: isCustomerSearchEnabled, toggle: toggleCustomerSearch } =
    useBoolean();
  const currentLocation = params.get("from_location_id");
  const [, setSelectedPrevCs] = React.useState<CustomerResponse | null>(null);
  const [search, setSearch] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState<string>("");
  const debounced = useDebounceCallback(setSearch, 300);

  const { data, isLoading } = trpc.searchProduct.useQuery(
    `${search}&${selectedLocation}`,
    {
      enabled: !!search
    }
  );
  const handleSelectCs = (cData: CustomerResponse) => {
    const fieldsToUpdate = {
      full_name: cData.name,
      phone: cData.phone,
      email: cData.email,
      address: cData.address
    };

    Object.entries(fieldsToUpdate).forEach(([field, value]) => {
      formik.setFieldValue(field, value);
    });

    setSelectedPrevCs(cData);
  };

  const clearAutoCompleteForm = () => {
    const fieldsToClear = ["full_name", "phone", "email", "address"];

    fieldsToClear.forEach((field) => {
      formik.setFieldValue(field, "");
    });

    setSelectedPrevCs(null);
  };

  const onEnabledSearchChange = () => {
    clearAutoCompleteForm();
    toggleCustomerSearch();
  };
  const isLocationInputError = !!search && !selectedLocation;

  const isEdit = !!params.get("from_location_id");

  React.useEffect(() => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
    }
  }, [currentLocation]);

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid
          container
          spacing={2}
        >
          {!isEdit && (
            <Grid
              item
              xs={12}
            >
              <FormControlLabel
                label="Aktifkan Pencarian Pelanggan Sebelumnya"
                control={
                  <Checkbox
                    value={isCustomerSearchEnabled}
                    onChange={onEnabledSearchChange}
                  />
                }
              />
            </Grid>
          )}

          <Grid
            item
            xs={4}
          >
            {!isCustomerSearchEnabled ? (
              <TextField
                name="full_name"
                label="Nama Pelanggan"
                fullWidth
                required
                value={formik.values.full_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.full_name && !!formik.errors.full_name}
                helperText={formik.touched.full_name && formik.errors.full_name}
              />
            ) : (
              <PreviouseCustomer
                onSelect={handleSelectCs}
                onClear={clearAutoCompleteForm}
              />
            )}
          </Grid>

          <Grid
            item
            xs={4}
          >
            <TextField
              name="company"
              label="Nama Perusahaan"
              fullWidth
              required
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.company && !!formik.errors.company}
              helperText={formik.touched.company && formik.errors.company}
            />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <TelInput
              required
              name="phone"
              label="Telepon"
              fullWidth
              value={formik.values.phone}
              onChange={(newValue) => formik.setFieldValue("phone", newValue)}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && !!formik.errors.phone}
              helperText={formik.touched.phone && formik.errors.phone}
            />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && !!formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <TextField
              name="address"
              label="Alamat"
              fullWidth
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && !!formik.errors.address}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <TextField
              type="search"
              fullWidth
              error={!!selectedLocation && !search}
              helperText={
                !!selectedLocation && !search ? "Search input is required" : ""
              }
              label="Cari Barang"
              onChange={(event) => debounced(event.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ pr: 0.5 }} />
              }}
            />
          </Grid>

          <Grid
            item
            xs={4}
          >
            <Autocomplete
              fullWidth
              disabled={order.length > 0}
              value={selectedLocation}
              onChange={(event, newValue) => {
                if (order.length > 0) {
                  return shortenAlert(
                    "warning",
                    "hanya bisa memilih lokasi sekali"
                  );
                }
                setSelectedLocation(newValue ?? "");
              }}
              loading={loading}
              options={locations}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Lokasi Persediaan"
                  required
                  helperText={
                    !isLocationInputError
                      ? "Pilih salah satu lokasi persedian barang"
                      : "Required"
                  }
                  error={isLocationInputError || error}
                />
              )}
            />
          </Grid>
        </Grid>
        <Box sx={{ px: 2, mt: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontStyle="italic"
          >
            {isLoading
              ? "Mencari..."
              : data && data.length > 0
              ? `Total Produk ${data.length}.`
              : `Tidak ada satupun barang dengan nama ${search} di Lokasi ${selectedLocation}`}
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{ mt: 2, overflowX: "auto", height: 250 }}
          >
            {data
              ? data.map((data, index) => (
                  <Grid
                    key={index}
                    item
                    xs={3}
                  >
                    <ProductCard
                      data={data}
                      selectedLocation={selectedLocation}
                    />
                  </Grid>
                ))
              : null}
          </Grid>
        </Box>
        <Box sx={{ display: "flex", my: 3, justifyContent: "end" }}>
          <Button
            endIcon={<NavigateNext />}
            type="submit"
            variant="contained"
          >
            Lanjutkan
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateOrderForm;
