"use client";

import * as React from "react";
import BaseModalChildren from "@/app/@components/Modal/BaseModalChildren";
import CreateAdminForm from "@/app/@components/Forms/CreateAdminForm";
import Add from "@mui/icons-material/Add";
import { useBoolean } from "usehooks-ts";
import RoundedButton from "@/app/@common/RoundedButton";

export default function CreateNewAdmin() {
  const { value, setFalse, setTrue } = useBoolean();

  return (
    <React.Fragment>
      <RoundedButton
        variant="contained"
        color="primary"
        endIcon={<Add />}
        onClick={() => setTrue()}
      >
        New Admin
      </RoundedButton>
      <BaseModalChildren
        isOpen={value}
        onClose={setFalse}
        onOpen={setTrue}
        title="Create New Admin"
      >
        <CreateAdminForm closeFn={setFalse} />
      </BaseModalChildren>
    </React.Fragment>
  );
}
