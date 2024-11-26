import * as React from "react";
import lodash from "lodash";
import Badge from "@mui/icons-material/Badge";
import Business from "@mui/icons-material/Business";
import Edit from "@mui/icons-material/Edit";
import LocationOn from "@mui/icons-material/LocationOn";
import Phone from "@mui/icons-material/Phone";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  TextField
} from "@mui/material";
import { CompanyInformation } from "@prisma/client";
import { useFormik } from "formik";
import TelInput from "@/components/Forms/Input/TelInput";
import { trpc } from "@/utils/trpc-client";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import { useBoolean } from "usehooks-ts";
import { shortenAlert } from "@/components/Alert/alert";

type Form = Omit<CompanyInformation, "id">;

const CompanySettings = () => {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.getCompanyInfo.useQuery();

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const { value, setFalse, setTrue } = useBoolean();

  const { mutate: update, isLoading: isUpdateLoading } =
    trpc.updateCompanyInfo.useMutation({
      onSuccess: () => {
        shortenAlert("success", "Complete to update");
        setIsEditOpen(false);
        utils.getCompanyInfo.invalidate();
      },
      onError: (err) => {
        if (err instanceof Error) {
          console.error(err.message);
          shortenAlert("error", "Error during update, try again later.");
        }
      }
    });

  const initialValue: Form = {
    name: data ? data.name : "",
    address: data ? data.address : "",
    tel: data ? data.tel : ""
  };

  function getLabel(key: keyof Form) {
    switch (key) {
      case "name":
        return "Nama";
      case "address":
        return "Alamat";
      case "tel":
        return "Telepon";
    }
  }

  const formik = useFormik<Form>({
    onSubmit: (value) => {
      if (data && data.id) {
        const { id } = data;
        return update({ ...value, id });
      }
    },
    initialValues: !isLoading ? initialValue : ({} as Form)
  });

  const toggle = () => {
    if (!isLoading) {
      setIsEditOpen(!isEditOpen);
    }
  };

  const indexingIcon = [
    <Badge key="name" />,
    <LocationOn key="location_icon" />,
    <Phone key="phone_icon" />
  ];
  const renderBaseInfo = Object.entries(initialValue).map(
    ([key, value], index) => (
      <Grid
        item
        xs={6}
        key={key}
      >
        <ListItem disablePadding>
          <ListItemIcon>{indexingIcon[index]}</ListItemIcon>
          <ListItemText
            primary={getLabel(key as keyof Form)}
            primaryTypographyProps={{
              sx: { textTransform: "capitalize" }
            }}
            secondary={isLoading ? <Skeleton variant="text" /> : value}
          />
        </ListItem>
      </Grid>
    )
  );

  const renderForm = (
    <form onSubmit={formik.handleSubmit}>
      <Grid
        container
        spacing={2}
        sx={{ px: 4, pb: 2, pt: 3 }}
      >
        <Grid
          item
          xs={6}
        >
          <TextField
            size="small"
            id="name"
            label="Nama"
            variant="outlined"
            fullWidth
            margin="dense"
            helperText=""
            defaultValue={initialValue.name}
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid
          item
          xs={6}
        >
          <TextField
            size="small"
            id="address"
            label="Alamat"
            variant="outlined"
            fullWidth
            margin="dense"
            helperText=""
            defaultValue={initialValue.address}
            value={formik.values.address}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid
          item
          xs={6}
        >
          <TelInput
            variant="outlined"
            fullWidth
            margin="dense"
            name="tel"
            id="tel"
            label="Telepon"
            value={formik.values.tel}
            onChange={(newPhone) => formik.setFieldValue("tel", newPhone)}
          />
        </Grid>
      </Grid>
    </form>
  );

  const isBothFormDataSame = lodash.isEqual(initialValue, formik.values);
  const handleDiscard = () => {
    if (!isBothFormDataSame) {
      setTrue();
    } else {
      setIsEditOpen(false);
    }
  };

  const cleanUp = () => formik.setValues(initialValue);

  React.useEffect(() => {
    if (initialValue.tel) {
      formik.setFieldValue("tel", initialValue.tel);
    }
  }, [initialValue.tel]);

  return (
    <Card sx={{ px: 1, mt: 2, height: 330 }}>
      <CardHeader
        title="Profil Perusahaan"
        avatar={<Business sx={{ fontSize: 32, color: "text.secondary" }} />}
        subheader="Info ini akan muncul di faktur dan laporan"
      />
      <CardContent>
        <Grid
          container
          spacing={4}
        >
          {isEditOpen ? renderForm : renderBaseInfo}
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: "end" }}>
        {isEditOpen ? (
          <>
            <Button
              color="error"
              onClick={handleDiscard}
              variant="outlined"
            >
              Batalkan
            </Button>
            <Button
              disabled={isBothFormDataSame}
              color="primary"
              onClick={() => formik.handleSubmit()}
              endIcon={isUpdateLoading ? <CircularProgress size={12} /> : null}
            >
              Update
            </Button>
          </>
        ) : (
          <IconButton onClick={toggle}>
            <Edit />
          </IconButton>
        )}
      </CardActions>
      <ConfirmDialog
        open={value}
        content="Butuh konfirmasi pembatalan, pergantian info tidak akan disimpan."
        onDisagree={setFalse}
        onAgree={() => {
          setFalse();
          setIsEditOpen(false);
          cleanUp();
        }}
      />
    </Card>
  );
};

export default CompanySettings;
