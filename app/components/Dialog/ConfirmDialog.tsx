"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress, Divider } from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content?: string;
  variant?: "success" | "error";
  loader?: boolean;
  onAgree: () => void;
  onDisagree: () => void;
}

export default function ConfirmDialog({
  open,
  title = "Konfirmasi",
  content = "Apakah Anda yakin akan melanjutkan?",
  onAgree,
  onDisagree,
  variant = "error",
  loader
}: ConfirmDialogProps) {
  return (
    <Dialog
      PaperProps={{
        sx: { minWidth: 500, height: 220 }
      }}
      open={open}
      onClose={onDisagree} // Close dialog when user tries to dismiss
    >
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          color='secondary'
          onClick={onDisagree}
        >
          Batalkan
        </Button>
        <Button
          variant='contained'
          color={variant}
          onClick={onAgree}
          autoFocus
          endIcon={!!loader ? <CircularProgress size={16} /> : null}
        >
          Setujui
        </Button>
      </DialogActions>
    </Dialog>
  );
}
