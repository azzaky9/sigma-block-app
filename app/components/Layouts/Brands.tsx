import { Typography } from "@mui/material";
import React from "react";

type Props = {
  text: string;
};

export default function Brands({ text }: Props) {
  return (
    <div className='h-7 w-full my-4'>
      <Typography
        variant='h5'
        align='center'
        fontWeight={600}
        className='text-gray-400'
      >
        {text}
      </Typography>
    </div>
  );
}
