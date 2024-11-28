import * as React from "react";

import { Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { Box } from "@mui/material";
import { trpc } from "@/utils/trpc-client";
import { useInputCategory, type FormsCreateProduct } from "@/lib/store";
import { useSearchParams } from "@remix-run/react";
import { CreateProduct } from "@/server/validation/base";
import ProductForm from "@/components/Forms/ProductForm";
import CategoriesForm, {
  nestedArrayValidationSchema,
  TNestedItems
} from "@/components/Forms/CategoriesForm";

type Props = {
  closeFn: () => void;
  defaultValues: FormsCreateProduct;
};

export default function CreateProductCategoryForm({ closeFn }: Props) {
  const utils = trpc.useUtils();

  const { cleanup, categories, deletedRecord } = useInputCategory();
  const { enqueueSnackbar: fireToast } = useSnackbar();

  const [params] = useSearchParams();

  const isEditProduct = params.has("editor_open");

  const initialValues: FormsCreateProduct & TNestedItems = React.useMemo(
    () => ({
      name: "",
      amountSupplier: "",
      amount: "",
      stock: 0,
      location: "Storage",
      supplier: "",
      origin: "",
      category: []
    }),
    []
  );

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

  const { mutateAsync: updateMutation } = trpc.updateProduct.useMutation({
    onSuccess: () => successAction(),
    onError: (err) => console.error(err.message)
  });
  const { mutateAsync: createMutation } = trpc.createProduct.useMutation({
    onSuccess: () => successAction(),
    onError: (err) => console.error(err.message)
  });

  const handleUpdateProduct = async (value: FormsCreateProduct) => {
    return await updateMutation({
      ...value,
      id: value.id!,
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
  };

  const handleCreateProduct = async (value: FormsCreateProduct) => {
    await createMutation({ ...value, category: categories });
  };

  const onSubmit = async (value: FormsCreateProduct) => {
    if (isEditProduct && value.id) {
      return await handleUpdateProduct(value);
    }
    await handleCreateProduct(value);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(
        CreateProduct.omit({ category: true }).merge(
          nestedArrayValidationSchema
        )
      )}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Box
            sx={{
              height: "430px",
              width: "100%",
              mt: 3,
              gap: 5,
              display: "grid",
              gridTemplateColumns: "1fr 1fr"
            }}
          >
            <ProductForm />
            <CategoriesForm />
          </Box>
        </Form>
      )}
    </Formik>
  );
}
