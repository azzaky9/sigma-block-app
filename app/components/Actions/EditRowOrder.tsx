import * as React from "react";
import { Tooltip, IconButton, StackProps } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";

type Props = {
  children?: React.ReactNode;
  onEditClick: () => void;
  onDeleteClick: () => void;
  direction?: StackProps["direction"];
};

const EditRowOrder = ({ children, onEditClick, onDeleteClick }: Props) => {
  return (
    <>
      <Tooltip title="Edit">
        <IconButton
          color="default"
          size="small"
          onClick={onEditClick}
        >
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          color="error"
          size="small"
          onClick={onDeleteClick}
        >
          <Delete />
        </IconButton>
      </Tooltip>
      {children}
    </>
  );
};

export default EditRowOrder;
