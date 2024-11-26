import React from "react";
import { CircularProgress, CircularProgressProps } from "@mui/material";

type Props = {
  label?: string;
  loaderProps: CircularProgressProps;
};

export default function Loader({ label, loaderProps }: Props) {
  return (
    <div className='flex flex-col gap-4 justify-center items-center'>
      <CircularProgress
        {...loaderProps}
        color='info'
      />
      {label ? <span>{label}</span> : null}
    </div>
  );
}
