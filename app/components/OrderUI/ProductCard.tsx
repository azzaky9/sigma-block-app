import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActions, IconButton, Tooltip } from "@mui/material";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import { useGlobalControlOrder, CategoryValue } from "@/lib/store";
import { Products } from "@/types/types";
import { grey } from "@mui/material/colors";

import { useSearchParams } from "@remix-run/react";
import { faker } from "@faker-js/faker";

type Props = {
  selectedLocation: string;
  data: Products;
};

const ProductCard = ({ data, selectedLocation }: Props) => {
  const { name, amount, category, id } = data;
  const { add, remove, hashSelectedProduct } = useGlobalControlOrder();

  const [params] = useSearchParams();
  const isEditMode = params.has("edit_order");

  const onAddProductToOrder = () => {
    const result = Object.fromEntries(
      data.category.map(({ id, ...other }): [string, CategoryValue] => [
        isEditMode ? String(faker.number.int({ max: 99999 })) : id,
        {
          name: other.name,
          categoryStockInSpecificLocationId:
            other.specificIdAtSelectedLocation!,
          from_location: selectedLocation,
          order_quantity: 0,
          price: other.price,
          maxOrder: other.stock,
          stock: other.stock
        }
      ])
    );

    add({
      product_connection_id: String(data.id),
      product_id: data.id,
      name: data.name,
      type: isEditMode ? "new-record" : undefined,
      categories: result,
      total_amount: data.amount
    });
  };

  const onRemoveProductOrder = () => remove(id);

  const isAlreadySelected = !!hashSelectedProduct[id];

  return (
    <Card
      variant="outlined"
      sx={{ color: isAlreadySelected ? grey["400"] : undefined }}
    >
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
        >
          {name}
        </Typography>
        <Typography color="text.secondary">Amount: {amount}</Typography>{" "}
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {category.length} Category
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "end", alignItems: "end" }}>
        {!isAlreadySelected ? (
          <Tooltip title="Add this product?">
            <IconButton onClick={onAddProductToOrder}>
              <Add />
            </IconButton>
          </Tooltip>
        ) : !isEditMode ? (
          <Tooltip title="Cancel this product?">
            <IconButton
              color="error"
              onClick={onRemoveProductOrder}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip
            className="hover:cursor-not-allowed"
            title="Already Added"
          >
            <IconButton
              color="default"
              disableRipple
            >
              <Add sx={{ color: "#ababab" }} />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
