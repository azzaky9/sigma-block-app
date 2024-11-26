import * as React from "react";

import { useBoolean } from "usehooks-ts";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "@remix-run/react";
import Container from "@mui/material/Container";
import VpnKey from "@mui/icons-material/VpnKey";
import Visibility from "@mui/icons-material/Visibility";
import LoaderButton from "@/components/Buttons/LoaderButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AlternateEmail from "@mui/icons-material/AlternateEmail";
import Typography, { TypographyProps } from "@mui/material/Typography";
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  styled
} from "@mui/material";

function Copyright(props: TypographyProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit">Some Company</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const AuthInput = styled(OutlinedInput)`
  border-radius: 14px;
  padding-left: 8px;
  input {
    padding: 10px 0;
  }
  label {
    transform: translate(14px, 14px) scale(1);
  }
`;

type Props = {
  token: string;
};

type FormData = {
  email: string;
  username?: string;
  password: string;
};

export default function AuthForms({ token }: Props) {
  const [isInvalid, setIsInvalid] = React.useState(false);
  const { value: isVisible, toggle: toggleVisible } = useBoolean();

  const navigate = useNavigate();

  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ["credential-signin"],
    mutationFn: async (credential: FormData) => {
      try {
        const { email, password } = credential;

        const res = await signIn("credentials", {
          redirect: false,
          email,
          password
        });

        if (res) {
          const baseUrl = new URL(res.url ?? "");
          const cbURL = baseUrl.searchParams.get("callbackUrl");

          if (res.ok) {
            return navigate(cbURL ?? "/dashboard");
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          setIsInvalid(true);
          enqueueSnackbar({
            variant: "error",
            message: "Invalid Credential"
          });
          console.log(error);
        }
      }
    }
  });
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const formData = {
      email: data.get("email")?.toString() || "",
      password: data.get("password")?.toString() || ""
    };

    await mutateAsync(formData);
  };

  return (
    <Container
      component={Paper}
      maxWidth="xs"
      variant="outlined"
      sx={{ borderRadius: 3, width: 405 }}
    >
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
        >
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={onsubmit}
          noValidate
          sx={{ mt: 4 }}
        >
          <input
            name="csrfToken"
            type="hidden"
            defaultValue={token}
          />

          <AuthInput
            required
            fullWidth
            id="email"
            placeholder="Email or Username"
            startAdornment={
              <InputAdornment position="start">
                <AlternateEmail fontSize="medium" />
              </InputAdornment>
            }
            sx={{ mb: 3 }}
            name="email"
            autoComplete="email"
            error={isInvalid}
            onChange={() => {
              if (isInvalid) {
                setIsInvalid(false);
              }
            }}
          />
          <AuthInput
            required
            fullWidth
            name="password"
            placeholder="Password"
            type={isVisible ? "text" : "password"}
            id="password"
            startAdornment={
              <InputAdornment position="start">
                <VpnKey fontSize="medium" />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleVisible}
                  onMouseDown={handleMouseDownPassword}
                >
                  {isVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            autoComplete="current-password"
            error={isInvalid}
            onChange={() => {
              if (isInvalid) {
                setIsInvalid(false);
              }
            }}
          />

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <LoaderButton
              type="submit"
              size="medium"
              variant="contained"
              isLoading={isLoading}
              disabled={isLoading}
              sx={{ mt: 2, mb: 2, width: "fit-content" }}
            >
              Sign In
            </LoaderButton>
          </Box>
        </Box>
      </Box>
      <Copyright sx={{ mt: 2, mb: 4 }} />
    </Container>
  );
}
