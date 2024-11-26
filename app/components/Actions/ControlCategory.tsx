import * as React from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Clear from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { grey, red } from "@mui/material/colors";
import { ProduceIncrementAction, useGlobalControlOrder } from "@/lib/store";

type Props = {
  ordered: number;
  max: number;
  controlId: ProduceIncrementAction;
  increment: () => void;
  decrement: () => void;
};

const ControlCategory = ({
  ordered,
  max,
  controlId,
  increment,
  decrement
}: Props) => {
  const { inc } = useGlobalControlOrder();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue <= max) {
      inc(controlId, newValue);
    }
  };

  return (
    <Stack
      direction="row"
      spacing={0.9}
    >
      <Tooltip title="delete">
        <IconButton
          disableRipple
          size="small"
        >
          <Clear sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          border: `1px solid ${ordered > max ? red["500"] : grey["300"]}`,
          borderRadius: 21,
          width: 110,
          gap: 0.2
        }}
      >
        <IconButton
          size="small"
          disableRipple
          onClick={decrement}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <input
          type="number"
          max={max}
          value={ordered}
          onChange={handleChange}
          className="outline-none border-none w-10 text-center text-md"
        />
        <IconButton
          size="small"
          disableRipple
          onClick={increment}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Stack>
  );
};

export default React.memo(ControlCategory);
