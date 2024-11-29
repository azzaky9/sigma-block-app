import * as React from "react";

import { useBoolean } from "usehooks-ts";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import { Form, useNavigation } from "@remix-run/react";
import Container from "@mui/material/Container";
import VpnKey from "@mui/icons-material/VpnKey";
import Visibility from "@mui/icons-material/Visibility";

import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AlternateEmail from "@mui/icons-material/AlternateEmail";
import Typography from "@mui/material/Typography";
import { IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import LoaderButton from "@/components/Buttons/LoaderButton";

type Props = {
  token: string;
  error: { email: string[]; password: string[] };
};

export default function AuthForms({ token, error }: Props) {
  const navigation = useNavigation();
  const { value: isVisible, toggle: toggleVisible } = useBoolean();

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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
        <div className="mt-4">
          <Form method="post">
            <input
              name="csrfToken"
              type="hidden"
              defaultValue={token}
            />

            <TextField
              size="small"
              required
              fullWidth
              id="email"
              disabled={navigation.state === "submitting"}
              error={error.email && error.email.length > 0}
              placeholder="Email"
              helperText={error.email ? error.email.join(", ") : ""}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmail fontSize="medium" />
                    </InputAdornment>
                  )
                }
              }}
              sx={{ mb: 3 }}
              name="email"
              autoComplete="off"
            />
            <TextField
              required
              fullWidth
              size="small"
              name="password"
              placeholder="Password"
              disabled={navigation.state === "submitting"}
              type={isVisible ? "text" : "password"}
              id="password"
              error={error.password && error.password.length > 0}
              helperText={error.password ? error.password.join(", ") : ""}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey fontSize="medium" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleVisible}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {isVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
              autoComplete="current-password"
            />

            <Box
              sx={{
                mt: 1,
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <LoaderButton
                type="submit"
                size="medium"
                variant="contained"
                isLoading={navigation.state === "submitting"}
                disabled={navigation.state === "submitting"}
                sx={{ mt: 1, mb: 2, width: "fit-content" }}
              >
                Sign In
              </LoaderButton>
              {/* <button type="submit">submit</button> */}
            </Box>
          </Form>
        </div>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 2, mb: 4 }}
      >
        {"Copyright © "}
        <Link color="inherit">Some Company</Link> {new Date().getFullYear()}
        {"."}
      </Typography>
    </Container>
  );
}
