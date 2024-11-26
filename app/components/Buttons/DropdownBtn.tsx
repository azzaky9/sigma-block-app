"use client";

import * as React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type Items = {
  label: string;
  ComponentProps: MenuItemProps;
};

type Props = {
  items: Items[];
  buttonSize?: ButtonProps["size"];
};

const DropdownBtn: React.FC<Props> = (props) => {
  const { items, buttonSize = "small" } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id='demo-customized-button'
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup='true'
        aria-expanded={open ? "true" : undefined}
        variant='contained'
        disableElevation
        size={buttonSize}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Locations
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {items.map(({ ComponentProps, label }, idx) => (
          <MenuItem
            key={idx}
            {...ComponentProps}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default DropdownBtn;
