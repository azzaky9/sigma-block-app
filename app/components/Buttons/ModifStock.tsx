import * as React from "react";
import NotInterested from "@mui/icons-material/NotInterested";
import { NumericFormatCustom } from "@/components/Forms/Input/NumericFormatCustom";
import { IconButton, TextField, Tooltip } from "@mui/material";
import { ReadableCategoryValidation } from "@/components/Forms/CategoriesForm";

type Props = {
  itemAttribute: ReadableCategoryValidation;
  name: string;
  index: number;
  isDisabled: boolean;
  removeItem: (id: number) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export default function ModifStock(props: Props) {
  const { itemAttribute, ...inputControl } = props;

  const suppressPropagation = (
    e: React.KeyboardEvent<any> | React.MouseEvent<HTMLDivElement>
  ) => e.stopPropagation();

  const handleNonNegative = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(Number(e.target.value), 1);
    console.log(newValue);
    inputControl.onChange({
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: newValue as any
      }
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = Number(value);
    inputControl.onChange({
      ...e,
      target: {
        ...e.target,
        name,
        value: newValue as any
      }
    });
  };

  return (
    <div className="my-1 grid grid-cols-3 items-center  gap-5">
      <TextField
        type="text"
        size="small"
        label="Nama"
        placeholder="e.g: Bata Merah"
        variant="outlined"
        margin="dense"
        disabled={inputControl.isDisabled}
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
        margin="dense"
        sx={{
          me: 2
        }}
        placeholder="e.g: Rp.2000"
        disabled={inputControl.isDisabled}
        name={`${inputControl.name}.price`}
        value={itemAttribute.price}
        onChange={handleNumberChange}
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
        <div className="flex gap-1">
          <TextField
            size="small"
            label="Kuantitas"
            type="number"
            margin="dense"
            disabled={inputControl.isDisabled}
            name={`${inputControl.name}.quantity`}
            value={itemAttribute.quantity}
            onChange={handleNonNegative}
            onBlur={inputControl.onBlur}
            onKeyDownCapture={suppressPropagation}
            onClickCapture={suppressPropagation}
          />
        </div>

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
