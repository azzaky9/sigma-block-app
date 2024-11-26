import * as React from "react";

// import { useDebounceValue } from "usehooks-ts";

import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import NotInterested from "@mui/icons-material/NotInterested";
// import { useInputCategory } from "@/lib/store";
import { NumericFormatCustom } from "@/components/Forms/NewProduct";
import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { ReadableCategoryValidation } from "@/components/Forms/CategoriesForm";

type Props = {
  itemAttribute: ReadableCategoryValidation;
  name: string;
  index: number;
  removeItem: (id: number) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export default function ModifStock(props: Props) {
  const { itemAttribute, ...inputControl } = props;

  // const nameControl = `${inputControl}.${itemAttribute.name}`;
  // console.log(nameControl);
  // const increment = useInputCategory((state) => state.inc);
  // const decrement = useInputCategory((state) => state.dec);
  // const updatePrice = useInputCategory((state) => state.updatePrice);
  // const [editablePrice, setEditablePrice] = React.useState(price);
  // const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEditablePrice(Number(e.target.value));
  // };
  // const [debouncedPrice] = useDebounceValue(editablePrice, 400);
  // React.useEffect(() => {
  //   updatePrice(itemAttribute.id, debouncedPrice);
  // }, [debouncedPrice]);

  const suppressPropagation = (
    e: React.KeyboardEvent<any> | React.MouseEvent<HTMLDivElement>
  ) => e.stopPropagation();

  return (
    <div className="my-1 grid grid-cols-3 items-center  gap-5">
      <TextField
        type="text"
        size="small"
        placeholder="Nama Barang"
        variant="outlined"
        name={`${inputControl.name}.name`}
        value={itemAttribute.name}
        onChange={inputControl.onChange}
        onBlur={inputControl.onBlur}
        onKeyDownCapture={suppressPropagation}
        onClickCapture={suppressPropagation}
      />
      <TextField
        label="Harga item"
        size="small"
        variant="outlined"
        sx={{
          me: 2
        }}
        placeholder="Contoh: Rp.2000"
        name={`${inputControl.name}.price`}
        value={itemAttribute.price}
        onChange={inputControl.onChange}
        onBlur={inputControl.onBlur}
        onKeyDownCapture={suppressPropagation}
        onClickCapture={suppressPropagation}
        slotProps={{
          input: {
            inputComponent: NumericFormatCustom as any
          }
        }}
      />
      <div className="flex items-center justify-center gap-1">
        <TextField
          label="Kuantitas"
          size="small"
          variant="outlined"
          name={`${inputControl.name}.quantity`}
          value={itemAttribute.quantity}
          onChange={inputControl.onChange}
          onBlur={inputControl.onBlur}
          onKeyDownCapture={suppressPropagation}
          onClickCapture={suppressPropagation}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={() => console.log("add + 1")}>
                    <Add sx={{ fontSize: 14, color: "primary.main" }} />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => console.log("decrease - 1")}>
                    <Remove sx={{ fontSize: 14, color: "primary.main" }} />
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />
        <Tooltip title="Hapus Kategori ini">
          <IconButton
            size="small"
            onClick={() => inputControl.removeItem(inputControl.index)}
            color="error"
          >
            <NotInterested fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
