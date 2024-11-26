"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Send from "@mui/icons-material/Send";
import ControlledSelect from "./Select/ControlledSelect";
import { trpc } from "@/client/trpc-client";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useFormik, FormikProvider } from "formik";
import { Admin } from "@/server/validation/base";
import type { VTAdminSchema } from "@/server/validation/base";
import { enqueueSnackbar } from "notistack";

const initial: VTAdminSchema = {
  email: "",
  password: "",
  role: "user",
  username: ""
};

type ReturnInputIdentity = {
  id: string;
  name: string;
  label: string;
};

type TRenderInputIdentity<T> = (key: keyof T) => ReturnInputIdentity;

export const renderInputIdentity: TRenderInputIdentity<VTAdminSchema> = (
  key
) => {
  const capitalize = key
    .split(" ")
    .map((k) => `${k.at(0)?.toUpperCase() + k.substring(1)}`)
    .join(" ");

  return { id: key, label: capitalize, name: key };
};

type Props = {
  closeFn: () => void;
};

export default function CreateAdminForm({ closeFn }: Props) {
  const utils = trpc.useUtils();
  const { isLoading, mutate } = trpc.createAdmin.useMutation({
    onSuccess: () => {
      utils.getAllAdmin.invalidate();

      closeFn();

      setTimeout(() => {
        enqueueSnackbar({
          variant: "success",
          message: "user completely created.",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        });
      }, 500);
    }
  });

  const formik = useFormik<VTAdminSchema>({
    initialValues: initial,
    validationSchema: toFormikValidationSchema(Admin),
    onSubmit: (values) => mutate(values)
  });

  if (isLoading) {
    return <p>Loading..</p>;
  }

  return (
    <div>
      <FormikProvider value={formik}>
        <form
          onSubmit={formik.handleSubmit}
          autoComplete="off"
          noValidate
        >
          <div className="flex flex-col gap-3">
            <TextField
              variant="standard"
              className="pb-1"
              {...renderInputIdentity("email")}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors.email)}
              helperText={formik.errors.email}
            />
            <TextField
              variant="standard"
              className="pb-1"
              {...renderInputIdentity("username")}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors.username)}
              helperText={formik.errors.username}
            />
            <TextField
              variant="standard"
              className="pb-1"
              {...renderInputIdentity("password")}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors.password)}
              helperText={formik.errors.password}
            />
            <ControlledSelect
              label="Select Role"
              name="role"
              options={[
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" }
              ]}
            />
          </div>
          <div className="w-full flex justify-end">
            <Button
              className="relative right-0 mt-8 rounded-3xl"
              variant="contained"
              type="submit"
              disabled={isLoading}
              endIcon={<Send />}
            >
              Submit
            </Button>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
}
