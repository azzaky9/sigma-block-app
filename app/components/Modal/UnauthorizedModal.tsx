"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import BaseModalChildren from "./BaseModalChildren";

type Props = {
  isOpen: boolean;
  onUnderstand: () => void | any;
};

export default function UnauthorizedDialog(props: Props) {
  const { isOpen, onUnderstand } = props;

  return (
    <BaseModalChildren
      title='Cannot Accessed.'
      isOpen={isOpen}
      blurMode='blurred'
      actions={
        <Button
          variant='contained'
          onClick={onUnderstand}
        >
          Understand
        </Button>
      }
    >
      <DialogContentText>
        {
          "Sorry you can't visit this page, you dont have any permission. please contact your administator for allow your permission if you want to manage the User Account"
        }
      </DialogContentText>
    </BaseModalChildren>
  );
}
