"use client";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider, IconButton } from "@mui/material";
import Close from "@mui/icons-material/Close";

export type Props = {
  isOpen: boolean;
  title: string | React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
  blurMode?: "default" | "blurred";
  minWidth?: number;
};

export default function BaseModalChildren(props: Props) {
  const {
    isOpen,
    onOpen,
    onClose,
    title,
    children,
    actions,
    blurMode,
    minWidth = 420
  } = props;

  return (
    <>
      <Dialog
        PaperProps={{ sx: { maxWidth: "100%", borderRadius: "12px" } }}
        className={
          blurMode && blurMode === "blurred"
            ? "filter backdrop-filter backdrop-blur-lg"
            : ""
        }
        open={isOpen}
        onClose={onClose}
      >
        <div className="w-full flex justify-between items-center pr-3">
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <Divider />
        <DialogContent
          sx={{ minWidth }}
          className="py-0 px-5"
        >
          {children}
        </DialogContent>
        <Divider />
        {actions ? (
          <DialogActions>{actions}</DialogActions>
        ) : (
          <div className="py-4" />
        )}
      </Dialog>
    </>
  );
}
