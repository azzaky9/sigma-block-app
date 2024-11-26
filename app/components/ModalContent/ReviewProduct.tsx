import * as React from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  TypographyProps
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { InteractiveOrder, useGlobalControlOrder } from "@/lib/store";
import { useCurrency } from "@/hooks/useCurrency";
import { useFormOrderControlStore } from "@/lib/zustand/store/formOrderStore";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";

type Props = {
  totalAmount: number;
};

type TPropsOrderInfo = {
  left: string;
  right: string;
  variant?: TypographyProps["variant"];
};

const OrderInfo = (props: TPropsOrderInfo) => (
  <ListItem
    disablePadding
    sx={{ display: "flex", justifyContent: "space-between" }}
  >
    <ListItemText
      secondaryTypographyProps={{
        variant: props.variant
      }}
      secondary={props.left}
    />
    <ListItemText
      secondary={props.right}
      secondaryTypographyProps={{
        variant: props.variant,
        sx: { textAlign: "right" }
      }}
    />
  </ListItem>
);

type GenerateTreeProps = { orders: InteractiveOrder[] };
export const GenerateTree = ({ orders }: GenerateTreeProps) => {
  const currency = useCurrency();

  return orders.map(({ product_id, name, categories }) => (
    <TreeItem
      itemId={String(product_id)}
      label={name}
      key={product_id}
    >
      {Object.entries(categories).map(
        ([key, { name, order_quantity, price }]) =>
          order_quantity > 0 && (
            <TreeItem
              itemId={String(key)}
              label={
                <Stack direction="row">
                  <ListItemText primary={name} />
                  <ListItemText
                    secondaryTypographyProps={{ textAlign: "right" }}
                    secondary={`${order_quantity} x ${currency.formatCurrency(
                      price
                    )}`}
                  />
                </Stack>
              }
              key={key}
            />
          )
      )}
    </TreeItem>
  ));
};

const ReviewProduct = ({ totalAmount }: Props) => {
  const formData = useFormOrderControlStore((state) => state.formData);
  const { order: orders, customerData } = useGlobalControlOrder();
  const currency = useCurrency();

  const getTotalDiscount = formData
    ? (totalAmount * Number(formData.disc)) / 100
    : 0;
  const discountTotal = formData ? totalAmount - getTotalDiscount : 0;
  const calcPriceTax = formData
    ? (discountTotal * Number(formData.tax)) / 100
    : 0;
  const result = formData ? discountTotal + calcPriceTax : 0;
  const paymentMethod =
    formData && formData.paymentMethod === "Custom"
      ? formData.customPayment
      : formData
      ? formData.paymentMethod
      : "";

  return (
    <Box sx={{ height: 360 }}>
      <Box sx={{ height: 200 }}>
        <SimpleTreeView
          aria-label="Order Summary"
          slots={{ expandIcon: ChevronRightIcon, collapseIcon: ExpandMoreIcon }}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
        >
          <GenerateTree orders={orders} />
        </SimpleTreeView>
      </Box>
      <Divider sx={{ my: 0.5 }} />
      <List>
        <OrderInfo
          variant="body2"
          left="Nama Pelanggan / Nama Perusahaan ~"
          right={customerData ? customerData.full_name : ""}
        />
        <OrderInfo
          variant="body2"
          left="Tujuan ~"
          right={
            customerData && customerData.address ? customerData.address : ""
          }
        />
        <OrderInfo
          variant="body2"
          left="Telepon ~"
          right={customerData && customerData.phone ? customerData.phone : ""}
        />
        <OrderInfo
          variant="body2"
          left="Metode Pembayaran ~"
          right={paymentMethod}
        />
        <OrderInfo
          left="Subtotal"
          variant="body2"
          right={formData ? currency.formatCurrency(totalAmount) : "0"}
        />
        <OrderInfo
          left={`Diskon ${formData ? formData.disc : ""}%`}
          variant="body2"
          right={currency.formatCurrency(getTotalDiscount)}
        />
        <OrderInfo
          left={`Pajak ${formData ? formData.tax : "11"}% `}
          variant="body2"
          right={currency.formatCurrency(calcPriceTax)}
        />

        <Divider />
        <OrderInfo
          variant="body1"
          left="Total"
          right={currency.formatCurrency(result)}
        />
      </List>
    </Box>
  );
};

export default React.memo(ReviewProduct);
