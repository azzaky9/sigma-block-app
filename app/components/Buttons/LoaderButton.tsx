import * as React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface LoaderButtonProps extends ButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoaderButton: React.FC<LoaderButtonProps> = ({
  isLoading,
  children,
  ...rest
}) => {
  return (
    <Button
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <CircularProgress
          size={16}
          color="inherit"
        />
      ) : (
        children
      )}
    </Button>
  );
};

export default LoaderButton;