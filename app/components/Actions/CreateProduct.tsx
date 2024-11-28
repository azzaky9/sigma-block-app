import * as React from "react";

import Add from "@mui/icons-material/Add";
import { useInputCategory } from "@/lib/store";
import { useSearchParams } from "@remix-run/react";
import { Box, Button, useTheme } from "@mui/material";
import BaseModalChildren from "@/components/Modal/BaseModalChildren";
import CreateProductCategoryForm from "@/components/Forms/CreateProductCategoryForm";

export const outerContainerSize = 800;

const CreateProduct = () => {
  const cleanup = useInputCategory((state) => state.cleanup);
  const formData = useInputCategory((state) => state.formData);

  const { isFormOpen, handleFormOpen, handleFormClose } = useInputCategory();

  const theme = useTheme();
  const [params, setSearchParams] = useSearchParams();

  const currentModalMode = params.get("mode");

  const handleClose = () => {
    handleFormClose();
    cleanup();

    if (currentModalMode === "edit") {
      setSearchParams(
        (prev) => {
          prev.delete("editor_open");
          prev.delete("mode");
          return prev;
        },
        { preventScrollReset: true }
      );
    }
  };

  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        size="medium"
        onClick={handleFormOpen}
        endIcon={
          <Add sx={{ color: theme.palette.common.white, fontSize: 20 }} />
        }
      >
        Buat Produk
      </Button>
      <BaseModalChildren
        isOpen={isFormOpen}
        title="Barang"
        onClose={handleClose}
        onOpen={handleFormOpen}
      >
        <CreateProductCategoryForm
          defaultValues={formData}
          closeFn={handleClose}
        />
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 2 }}
        >
          <div />
        </Box>
      </BaseModalChildren>
    </React.Fragment>
  );
};

export default CreateProduct;
