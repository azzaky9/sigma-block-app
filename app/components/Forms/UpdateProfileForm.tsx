"use cient";

import * as React from "react";
import { Form, useFormik } from "formik";
import { TextField, Button, Grid, CircularProgress } from "@mui/material";
import { FormikProvider } from "formik";
import { trpc } from "@/client/trpc-client";
import { enqueueSnackbar } from "notistack";

type Form = {
  username: string;
  email: string;
};
type Props = {
  closeEditor: () => void;
  initialValues: Form;
  session: any;
  refetchProfile: any;
};

const UpdateProfileForm = ({
  closeEditor,
  initialValues,
  session,
  refetchProfile
}: Props) => {
  const { update } = session;
  const { isLoading, mutate, isError, error } = trpc.updateProfile.useMutation({
    onSuccess: async (data) => {
      await update({
        ...session,
        user: {
          ...session?.user,
          email: data.email,
          name: data.username
        }
      });

      enqueueSnackbar({
        variant: "success",
        message: "Complete to update Profile"
      });

      refetchProfile();

      setTimeout(() => {
        closeEditor();
      }, 300);
    },
    onError: (err) => {
      if (err instanceof Error) {
        console.error(err.message);
      }

      enqueueSnackbar({
        variant: "error",
        message: "Failed to update Profile, Try again later."
      });
    }
  });

  const formik = useFormik<Form>({
    initialValues: initialValues,
    onSubmit: (value) => {
      if (session.data) {
        return mutate({
          id: session.data.user.id,
          email: value.email,
          username: value.username
        });
      }
    }
  });

  const testing = () => {
    mutate({
      id: 12,
      email: "abcd@gmail.com",
      username: "abcde"
    });
  };

  const isBothValueSame =
    formik.values.username === initialValues.username &&
    formik.values.email === initialValues.email;

  if (isError && error.data) {
    console.error(JSON.stringify(error.data.zodError, null, 2));
  }

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={6}
          >
            <TextField
              size='small'
              name='username'
              label='Username'
              variant='outlined'
              fullWidth
              margin='normal'
              value={formik.values.username}
              onChange={formik.handleChange}
              error={!!formik.errors.username && formik.touched.username}
              helperText={
                formik.errors.username &&
                formik.touched.username &&
                formik.errors.username
              }
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <TextField
              name='email'
              label='Email'
              size='small'
              variant='outlined'
              value={formik.values.email}
              fullWidth
              margin='normal'
              onChange={formik.handleChange}
              error={!!formik.errors.email && formik.touched.email}
              helperText={
                formik.errors.email &&
                formik.touched.email &&
                formik.errors.email
              }
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "end", gap: 1.2 }}
          >
            <Button
              variant='outlined'
              color='error'
              onClick={closeEditor}
            >
              Cancel
            </Button>
            <Button
              disabled={isBothValueSame || isLoading}
              variant='contained'
              color='primary'
              type='submit'
            >
              {isLoading ? <CircularProgress size={16} /> : `Submit`}
            </Button>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
};

export default UpdateProfileForm;
