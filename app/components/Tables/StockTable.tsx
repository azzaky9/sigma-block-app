"use client";

import { useMemo, useState } from "react";

import moment from "moment";
import { useBoolean } from "usehooks-ts";
import { enqueueSnackbar } from "notistack";
import { Package } from "lucide-react";
import {
  MaterialReactTable,
  MRT_EditActionButtons,
  MRT_ToggleGlobalFilterButton,
  type MRT_ColumnDef,
  useMaterialReactTable,
  MRT_ToggleFiltersButton
} from "material-react-table";

import { trpc } from "@/utils/trpc-client";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { grey } from "@mui/material/colors";
import type { Products } from "@/types/types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Category as TCategory } from "@/types/types";
import { useCurrency } from "@/hooks/useCurrency";
import { formatCurrency } from "@/server/service/formatCurrency";
import {
  useInputCategory,
  useLocationStore,
  useModalCategoryStore
} from "@/lib/store";
import {
  Badge,
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";

import { usStates } from "@/components/Tables/dev/makeData";
import { TextCapitalize } from "@/components/Tables/OrderTable";
import TransferList from "@/components/Modal/TransferStock";
import ListItemDialog from "@/components/Dialog/ListItemDialog";
import StockCustomToolbar from "@/components/Actions/StockToolbar";
import StockInOut from "@/components/Modal/StockInOut";
import FindReplace from "@mui/icons-material/FindReplace";
import Inventory from "@mui/icons-material/Inventory";

const StockTable = () => {
  const currency = useCurrency();
  const currentLocation = useLocationStore((state) => state.selectedLocation);
  const openDrawer = useModalCategoryStore((state) => state.open);
  const { handleFormOpen, setFormData, setCategories } = useInputCategory();

  const [params, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<TCategory[]>([]);

  const {
    value: isCategoryOpen,
    setTrue: openCategoryEditor,
    setFalse: closeCategoryEditor
  } = useBoolean();
  const {
    value: isViewMonitoring,
    setTrue: openMonitoring,
    setFalse: closeMonitoring
  } = useBoolean();

  const handleOpenCategory = (value: TCategory[]) => {
    setSelectedCategory(value);
    openCategoryEditor();
  };

  const handleOpenFormEdit = (selectedRow: Products) => {
    setSearchParams({ ...params, editor_open: "true", mode: "edit" });

    handleFormOpen();
    setFormData({
      id: selectedRow.id,
      amount: String(selectedRow.amount),
      supplier: selectedRow.supplier ? selectedRow.supplier : "",
      amountSupplier: String(selectedRow.amount_supplier),
      location: currentLocation,
      name: selectedRow.name,
      stock: selectedRow.stock,
      origin: "purchase"
    });
    setCategories(
      selectedRow.category.map((c) => ({ ...c, types: "original" }))
    );
  };

  const {
    data: fetchedProducts = [],
    isError: isLoadingProductsError,
    isLoading: isLoadingProducts,
    isRefetching: isRefetchProducts,
    refetch: refetchProducts
  } = useGetProducts({ location: currentLocation });
  const { mutate: deleteMutation } = trpc.deleteProductById.useMutation({
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "product success to delete."
      });

      refetchProducts();
    }
  });

  const columns = useMemo<MRT_ColumnDef<Products>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Produk",
        enableSorting: false,
        enableColumnActions: false,
        muiEditTextFieldProps: {
          required: true
        },
        Cell: ({ cell }) => <TextCapitalize value={cell.getValue() as string} />
      },

      {
        accessorKey: "updated_at",
        header: "Di Update Pada",
        size: 200,
        Cell: (value) => {
          const dates = moment(value.cell.getValue() as string).format(
            "DD/MM/YYYY - HH:mm"
          );

          return dates;
        },
        enableSorting: false,
        enableColumnActions: false,
        muiEditTextFieldProps: {
          type: "email",
          required: true
        }
      },
      {
        accessorKey: "amount_supplier",
        header: "Pengeluaran",
        Cell: ({ row }) => (
          <TextCapitalize
            value={formatCurrency(row.original.amount_supplier)}
          />
        )
      },
      {
        accessorKey: "supplier",
        header: "Pemasok",
        Cell: ({ cell }) => (
          <TextCapitalize
            value={cell.getValue() ? (cell.getValue() as string) : "not set"}
          />
        )
      },
      {
        accessorKey: "manufacturer",
        header: "Pabrikan",
        Cell: ({ cell }) => (
          <TextCapitalize
            value={cell.getValue() ? (cell.getValue() as string) : "not set"}
          />
        )
      },
      {
        accessorKey: "created_by_user",
        header: "Admin",
        maxSize: 160,
        size: 120,
        Cell: (value) => {
          const adminObj = value.cell.getValue() as Products["created_by_user"];

          return (
            <Stack direction="column">
              <TextCapitalize value={adminObj ? adminObj.username : ""} />
            </Stack>
          );
        }
      },
      {
        accessorKey: "created_at",
        Cell: (value) => {
          const dates = moment(value.cell.getValue() as string).format(
            "DD/MM/YYYY - HH:mm"
          );

          return <span>{dates}</span>;
        },
        header: "Dibuat Pada",
        enableSorting: false,
        enableColumnActions: false,
        editVariant: "select",
        editSelectOptions: usStates,
        muiEditTextFieldProps: {
          select: true
        },
        size: 200
      },
      {
        accessorKey: "category",
        header: "Kategori",
        enableSorting: false,
        Cell: (value) => (
          <Tooltip title="Cek Kategori">
            <IconButton
              color="secondary"
              component="button"
              sx={{ width: "fit-content" }}
              onClick={() => handleOpenCategory(value.row.original.category)}
            >
              <Badge
                badgeContent={value.row.original.category.length}
                color="secondary"
              >
                <Inventory />
              </Badge>
            </IconButton>
          </Tooltip>
        )
      },
      {
        accessorKey: "row-custom-actions",
        header: "Edit",
        enableSorting: false,
        size: 150,
        muiTableBodyCellProps: () => ({
          sx: {
            borderRight: `1px solid ${grey["300"]}`
          }
        }),
        Cell: ({ row }) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                color="info"
                onClick={() => handleOpenFormEdit(row.original)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hapus">
              <IconButton
                color="error"
                onClick={() => handleDelete(row.original.product_location_id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Pindahkan">
              <IconButton
                onClick={() => setSelectedProduct(row.original.id)}
                color="default"
              >
                <Forward absoluteStrokeWidth />
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Monitoring Barang in\out">
              <IconButton
                onClick={openMonitoring}
                color="secondary"
              >
                <FindReplace />
              </IconButton>
            </Tooltip>
          </>
        )
      }
    ],
    [currency, openDrawer]
  );

  const handleDelete = (productId: string) => {
    const isConfirm = confirm("Do you want to delete this product?");

    if (isConfirm) {
      deleteMutation(productId);
    }
  };

  const table = useMaterialReactTable<Products>({
    columns,
    data: fetchedProducts,
    createDisplayMode: "modal",
    // editDisplayMode: "modal",
    enableEditing: false,
    layoutMode: "grid-no-grow",
    enableFullScreenToggle: false,
    enablePagination: true,
    enableDensityToggle: false,
    enableColumnFilters: true,
    enableColumnActions: false,
    enableStickyHeader: true,
    filterFromLeafRows: true,
    getRowId: (row) => String(row.id),
    muiToolbarAlertBannerProps: isLoadingProductsError
      ? {
          color: "error",
          children: "Error loading data"
        }
      : undefined,
    muiPaginationProps: {
      shape: "rounded",
      showRowsPerPage: true,
      variant: "text"
    },
    paginationDisplayMode: "pages",
    muiTableContainerProps: {
      sx: {
        height: "600px",
        overflow: "auto",
        bgcolor: "white"
      }
    },
    muiTablePaperProps: {
      sx: { maxWidth: "82vw", width: "100%" }
    },
    enableHiding: false,
    renderTopToolbarCustomActions: () => <StockCustomToolbar />,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create Stock</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons
            variant="text"
            table={table}
            row={row}
          />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Products</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons
            variant="text"
            table={table}
            row={row}
          />
        </DialogActions>
      </>
    ),
    mrtTheme: {
      baseBackgroundColor: "#ffffff"
    },
    enableRowNumbers: false,
    renderToolbarInternalActions: ({ table }) => (
      <Box sx={{ py: 1 }}>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
      </Box>
    ),
    state: {
      showSkeletons: isLoadingProducts || isRefetchProducts,
      showProgressBars: false,
      isLoading: false,
      showAlertBanner: isLoadingProductsError
    },
    initialState: {
      columnPinning: { left: ["row-custom-actions"] }
    }
  });

  return (
    <div>
      <MaterialReactTable table={table} />
      <TransferList />
      <StockInOut
        setFalse={closeMonitoring}
        setTrue={openMonitoring}
        isViewMonitoring={isViewMonitoring}
      />
      <ListItemDialog
        open={isCategoryOpen}
        handleClose={closeCategoryEditor}
        listItems={selectedCategory.map((a, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${a.name}`}
              secondary={formatCurrency(a.price)}
            />
            <ListItemSecondaryAction>
              <Stack
                direction="row-reverse"
                justifyContent="center"
                alignItems="center"
                gap={2}
              >
                <Tooltip title="Stock">
                  <Package
                    size={16}
                    className="text-gray-600"
                  />
                </Tooltip>
                <Typography
                  variant="body1"
                  color="text.secondary"
                >
                  {a.stock}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      />
    </div>
  );
};

type TGetProductsParam = { location: string | null };
function useGetProducts({ location }: TGetProductsParam) {
  return trpc.getProducts.useQuery(location ?? "Storage");
}

export default StockTable;
