"use client";

// ListItemDialog.tsx
import * as React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { Button } from "@mui/material";
import BaseModalChildren from "../Modal/BaseModalChildren";

type Props = {
  open: boolean;
  handleClose: () => void;
  eachAction?: (params: any | null) => void;
  title?: string;
  listItems: (React.ReactNode | JSX.Element)[];
};

const ListItemDialog: React.FC<Props> = ({ open, handleClose, listItems }) => {
  return (
    <BaseModalChildren
      title='List Category'
      isOpen={open}
      onClose={handleClose}
      actions={<Button onClick={handleClose}>Close</Button>}
    >
      <List
        disablePadding
        sx={{ height: "300px", overflowY: "auto" }}
      >
        {listItems.length === 0 ? (
          <ListItemText primary={"This product does not have a category"} />
        ) : (
          listItems.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))
        )}
      </List>
    </BaseModalChildren>
  );
};

export default ListItemDialog;
