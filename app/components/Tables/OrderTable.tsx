import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_ToggleFiltersButton,
  MRT_ToggleGlobalFilterButton
} from "material-react-table";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Add from "@mui/icons-material/Add";
import { GenerateTree } from "@/components/ModalContent/ReviewProduct";
import { DatePicker } from "@mui/x-date-pickers";
import EditRowOrder from "@/components/Actions/EditRowOrder";
import { OrderTableData, ProductOrder } from "@/types/types";
import { trpc } from "@/utils/trpc-client";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import { useBoolean } from "usehooks-ts";
import moment from "moment";
import BaseModalChildren from "@/components/Modal/BaseModalChildren";
import CreateOrderForm from "@/components/Forms/CreateOrderForm";
import {
  useGlobalControlOrder,
  type TAB_OPTION,
  CategoryValue
} from "@/lib/store";
import Orders from "@/components/OrderUI/Orders";
import { shortenAlert } from "@/components/Alert/alert";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { RequiredForm } from "@/components/Actions/CreateShippingLetter";
import { useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import DownloadOption from "@/components/Actions/DownloadOption";

type ActionType = "UPDATE_STATUS" | "DELETE";
export type LetterShippingDefaultData = {
  shippingTo: string;
  orders: ProductOrder[];
};

export const TextCapitalize = ({ value }: { value: string }) => (
  <Typography
    variant="body2"
    textTransform="capitalize"
  >
    {value}
  </Typography>
);

export const OrderTable = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedId, setSelectedId] = useState("");
  const [actionType, setActionType] = useState<ActionType>("UPDATE_STATUS");
  const [keepSelectedAmount, setKeepSelectedAmount] = useState("");
  const [reviewProductOrderId, setReviewProductOrderId] = useState("");
  const [keepEntireSelectedData, setKeepEntireSelectedData] =
    useState<OrderTableData | null>(null);

  const { value: isOpen, setTrue: onOpen, setFalse: onClose } = useBoolean();
  const {
    value: isWantDownloadLetterShipping,
    setTrue: openDownloadLetterShipping,
    setFalse: closeDownloadLetterShipping
  } = useBoolean();
  const {
    value: isCreateOrderOpen,
    setTrue: createOrder,
    setFalse: closeCreateOrder
  } = useBoolean();
  const {
    value: isConfirmNextOpen,
    setFalse: closeConfirmationNext,
    setTrue: openConfirmationNext
  } = useBoolean();
  const { currentTab, setCurrentTab, add, cleanup } = useGlobalControlOrder();

  const [params] = useSearchParams();

  const closeAndClearState = () => {
    cleanup();
    closeCreateOrder();
    setCurrentTab("register");
    setKeepEntireSelectedData(null);

    if (params.has("edit_order")) {
      navigate(currentPath, { preventScrollReset: false });
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
    const incomingValue = newValue as TAB_OPTION;
    if (incomingValue === "order") {
      return setCurrentTab("order");
    }
    setCurrentTab(newValue as TAB_OPTION);
  };

  const utils = trpc.useUtils();
  const { data: productOrder, isLoading: isLoadProductOrder } =
    trpc.getOrderProduct.useQuery(reviewProductOrderId, {
      enabled: !!reviewProductOrderId
    });
  const {
    data: orderData,
    isLoading,
    isRefetching
  } = trpc.getOrders.useQuery(
    date ? date.toISOString() : new Date().toISOString(),
    {
      enabled: !isCreateOrderOpen
    }
  );
  const { isLoading: isUpdateStatusLoading, mutate: updateStatus } =
    trpc.updateStatusOrder.useMutation({
      onSuccess: () => {
        shortenAlert("success", "Complete to update");
        setSelectedId("");
        onClose();

        utils.getOrders.invalidate();
        utils.getBannerInfo.invalidate();
      },
      onError: (err) => {
        console.log(err.message);
        shortenAlert("error", "Error during updating, try again later");
      }
    });
  const { isLoading: isDeleteOrderLoading, mutate: deleteOrder } =
    trpc.deleteOrder.useMutation({
      onSuccess: () => {
        shortenAlert("success", "Complete to delete");
        setSelectedId("");
        setActionType("UPDATE_STATUS");
        onClose();

        utils.getOrders.invalidate();
      },
      onError: (err) => {
        console.log(err.message);
        shortenAlert("error", "Error during updating, try again later");
      }
    });

  const fireDeleteAction = (orderId: string) => {
    onOpen();
    setActionType("DELETE");
    setSelectedId(orderId);
  };

  const columns = useMemo<MRT_ColumnDef<OrderTableData>[]>(
    () => [
      {
        accessorKey: "customer.fullName",
        header: "Nama",
        Cell: ({ cell }) => (
          <TextCapitalize value={cell.getValue() as string} />
        ),
        grow: true
      },
      {
        accessorKey: "customer.phone",
        header: "Telepon"
      },
      {
        accessorKey: "customer.address",
        header: "Alamat",
        Cell: ({ cell }) => <TextCapitalize value={cell.getValue() as string} />
      },
      {
        accessorKey: "createdAt",
        header: "Dibuat Tanggal"
      },
      {
        accessorKey: "admin",
        header: "Di Update Oleh",
        muiTableBodyCellProps: {
          sx: { textAlign: "center" }
        },
        Cell: ({ cell }) => (
          <TextCapitalize value={cell.getValue() as string} />
        ),
        enableColumnActions: false,
        enableSorting: false,
        enableFilterMatchHighlighting: true
      },
      {
        accessorKey: "totalAmountsOrder",
        header: "Harga Total"
      },
      {
        accessorKey: "paymentMethod",
        header: "Metode Pembayaran"
      },
      {
        accessorKey: "products",
        header: "Produk",
        enableColumnFilter: false,
        enableColumnActions: false,
        Cell: ({ row }) => (
          <Button
            variant="outlined"
            color="info"
            size="small"
            onClick={() => {
              // reviewProduct();
              setReviewProductOrderId(row.original.id);
            }}
          >
            Produk
          </Button>
        )
      },
      {
        accessorKey: "editor-action",
        header: "Kontrol",
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <EditRowOrder
            onDeleteClick={() => fireDeleteAction(row.original.id)}
            onEditClick={() => {
              const getLocationCategory =
                row.original.products[0].orderCategory[0].fromLocation;

              if (!!getLocationCategory) {
                router.replace(
                  `${currentPath}?from_location_id=${getLocationCategory}&edit_order=${row.original.id}`,
                  { scroll: false }
                );
              }

              createOrder();

              row.original.products.forEach((product) => {
                add({
                  product_connection_id: product.productConnectionId,
                  product_id: +product.productId,
                  type: "original",
                  name: product.name,
                  total_amount: product.totalAmount,
                  categories: Object.fromEntries(
                    product.orderCategory.map(
                      ({ id, ...other }): [string, CategoryValue] => [
                        id,
                        {
                          name: other.name,
                          categoryStockInSpecificLocationId:
                            other.specificIdAtSelectedLocation!,
                          from_location: other.fromLocation,
                          order_quantity: other.orderStock,
                          price: other.price,
                          maxOrder: other.atLocationStock + other.orderStock,
                          stock: other.atLocationStock
                        }
                      ]
                    )
                  )
                });
              });

              setKeepEntireSelectedData(row.original);
            }}
          >
            <DownloadOption
              clickRowData={row}
              onLetterButtonClick={() => {
                openDownloadLetterShipping();
                setKeepSelectedAmount(row.original.totalAmountsOrder);
                setKeepEntireSelectedData(row.original);
              }}
            />
          </EditRowOrder>
        )
      }
    ],
    []
    //end
  );

  const handleUpdateOrDelete = (id: string) => {
    if (actionType === "UPDATE_STATUS") {
      updateStatus({ id, status: "success" });
    }

    if (actionType === "DELETE") {
      deleteOrder({ id });
    }
  };

  const table = useMaterialReactTable<OrderTableData>({
    columns,
    data: orderData || [],
    layoutMode: "grid-no-grow",

    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Status",
        grow: false
      }
    },
    enablePagination: true,
    enableRowActions: true,
    enableRowNumbers: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionActionsColumn: "last",
    mrtTheme: {
      baseBackgroundColor: "#ffffff"
    },
    muiTablePaperProps: {
      sx: { maxWidth: "82vw" }
    },
    initialState: {
      columnPinning: { left: ["editor-action"] }
    },
    state: {
      isLoading: isLoading || isRefetching,
      showSkeletons: isLoading || isRefetching,
      showProgressBars: false
    },
    muiPaginationProps: {
      color: "secondary",
      shape: "rounded",
      showRowsPerPage: true,
      variant: "outlined"
    },
    paginationDisplayMode: "pages",
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
        <Tooltip title="Buat Pesanan Baru">
          <IconButton onClick={createOrder}>
            <Add />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Box>
        <DatePicker
          defaultValue={moment(date)}
          onChange={(newValue) => {
            if (newValue) {
              setDate(newValue.toDate());
            }
          }}
          value={moment(date)}
          sx={{ mb: 2, height: "50px" }}
          slotProps={{
            textField: { size: "small" },
            inputAdornment: {
              position: "start"
            }
          }}
        />
      </Box>
    ),
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        <Tooltip title="Buat orderan ini menjadi selesai.">
          <Button
            variant="outlined"
            color={row.original.status === "process" ? "warning" : "success"}
            size="small"
            onClick={() => {
              onOpen();
              setSelectedId(row.original.id);
            }}
          >
            {row.original.status}
          </Button>
        </Tooltip>
      </Box>
    )
  });

  const renderConfirmSuccess = (
    <ConfirmDialog
      open={isOpen}
      onAgree={() => handleUpdateOrDelete(selectedId)}
      onDisagree={onClose}
      variant={actionType === "UPDATE_STATUS" ? "success" : "error"}
      loader={isUpdateStatusLoading || isDeleteOrderLoading}
    />
  );

  // modal for review product
  const renderReviewProduct = (
    <BaseModalChildren
      isOpen={!!reviewProductOrderId}
      minWidth={450}
      title="Review Product"
      actions={
        <Stack direction={"row"}>
          <Button onClick={() => setReviewProductOrderId("")}>Close</Button>
        </Stack>
      }
    >
      {/* <ReviewProduct data={selectedData} /> */}
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        {isLoadProductOrder ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeContent: "center"
            }}
          >
            <CircularProgress size={21} />
          </Box>
        ) : productOrder && productOrder.length > 0 ? (
          <GenerateTree orders={productOrder ? productOrder : []} />
        ) : (
          <Typography
            variant="h6"
            fontStyle="italic"
            color="text.secondary"
          >
            Invalid Product Order.
          </Typography>
        )}
      </TreeView>
    </BaseModalChildren>
  );

  const insertDefaultEditData = (data: OrderTableData) => {
    return {
      full_name: data.customer.fullName || "",
      phone: data.customer.phone || "",
      address: data.customer.address || "",
      company: data.customer.company || "",
      priceVariant: "normal",
      paymentMethod: "Cash",
      email: data.customer.email || "",
      customerId: data.customer.id || ""
    };
  };

  const memoizeGetDefaultData = React.useCallback(() => {
    if (keepEntireSelectedData) {
      return insertDefaultEditData(keepEntireSelectedData);
    }
  }, [keepEntireSelectedData]);

  const renderTabContent =
    currentTab === "register" ? (
      <CreateOrderForm
        editDefaultData={memoizeGetDefaultData()}
        openConfirmationNextHandler={openConfirmationNext}
      />
    ) : (
      <Orders />
    );

  const isEditMode = !!params.get("edit_order");

  // modal for creating order
  const renderCreateOrder = (
    <BaseModalChildren
      isOpen={isCreateOrderOpen}
      minWidth={900}
      title={isEditMode ? "Edit Pesanan" : "Buat Pesanan"}
      actions={
        <Stack direction={"row"}>
          <Button
            color="error"
            onClick={() => closeAndClearState()}
          >
            Tutup
          </Button>
        </Stack>
      }
    >
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTabs}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab
            disabled={currentTab === "order"}
            value="register"
            label="Pelanggan"
          />

          <Tab
            value="order"
            label={
              <Badge
                color="info"
                // badgeContent={order.length > 0 ? order.length : undefined}
              >
                <Typography variant="body2">Review Pesanan</Typography>
              </Badge>
            }
          />
        </Tabs>
      </Box>
      <Box sx={{ height: 500, px: 3, pt: 4 }}>
        {renderTabContent}
        <ConfirmDialog
          open={isConfirmNextOpen}
          onAgree={() => {
            setCurrentTab("order");
            closeConfirmationNext();
          }}
          onDisagree={closeConfirmationNext}
          title="Konfirmasi"
          variant="success"
          content={`Apakah anda yakin ingin melanjutkan ke tahap selanjutnya?, data pada saat ini tidak dapat di ubah kembali`}
        />
      </Box>
    </BaseModalChildren>
  );

  const renderDialogInputLetterShipping = (
    <BaseModalChildren
      isOpen={isWantDownloadLetterShipping}
      title="Buat Surat Jalan"
      onClose={closeDownloadLetterShipping}
      onOpen={openDownloadLetterShipping}
      actions={
        <Stack direction="row">
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              closeDownloadLetterShipping();
              setKeepSelectedAmount("");
              setKeepEntireSelectedData(null);
            }}
          >
            Close
          </Button>
        </Stack>
      }
    >
      <Box sx={{ height: "450px" }}>
        {!!keepSelectedAmount && (
          <RequiredForm
            amount={keepSelectedAmount}
            closeFn={closeDownloadLetterShipping}
            defaultOrderData={keepEntireSelectedData ?? ({} as OrderTableData)}
          />
        )}
      </Box>
    </BaseModalChildren>
  );

  React.useEffect(
    () => navigate(currentPath, { preventScrollReset: false }),
    []
  );

  return (
    <Box
      component="section"
      sx={{ px: 1, pt: 3 }}
    >
      <MaterialReactTable table={table} />
      {renderConfirmSuccess}
      {renderReviewProduct}
      {renderCreateOrder}
      {renderDialogInputLetterShipping}
    </Box>
  );
};

export default OrderTable;
