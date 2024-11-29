import * as React from "react";
import { useBoolean } from "usehooks-ts";
import { enqueueSnackbar } from "notistack";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import { Link, useLocation } from "@remix-run/react";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import SpaceDashboard from "@mui/icons-material/SpaceDashboard";
import { alpha, darken, Divider, Typography, useTheme } from "@mui/material";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import { bottomItems, items, SidebarItems } from "./utils/items";
import Navbar from "./Navbar";

const drawerWidth = "15vw";

type Props = {
  children: React.ReactNode;
};

export default function MainSidebar({ children }: Props) {
  const {
    value: isOpen,
    setFalse: handleClose,
    setTrue: handleOpen
  } = useBoolean();

  const handleAgree = async () =>
    enqueueSnackbar({ variant: "info", message: "Sign Out" });

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        color: "text.primary",
        paddingTop: 10,
        px: 2
      }}
      className="bg-slate-50"
    >
      <Navbar drawerWidth={drawerWidth} />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        }}
      >
        <List>
          <ListItem
            disablePadding
            sx={{
              display: "flex",
              width: "100%",
              gap: 2.2,
              pl: 3.2,
              ps: 2,
              py: 0.5
            }}
          >
            {/* <SpaceDashboard
              sx={(theme) => ({ color: theme.palette.primary.main })}
            /> */}
            <Typography
              variant="h6"
              sx={(theme) => ({
                textTransform: "capitalize",
                fontWeight: 500,
                color: darken(theme.palette.primary.main, 0.5)
              })}
            >
              {"\u2000"}
            </Typography>
          </ListItem>
        </List>
        <Box
          className="h-full "
          sx={{ overflow: "auto", mt: 1 }}
        >
          <Box className="w-full relative flex flex-col justify-between  ">
            <List
              subheader={
                <Typography
                  variant="body2"
                  sx={{ px: 2, py: 1 }}
                  color="text.secondary"
                >
                  Menu
                </Typography>
              }
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 1,
                pt: 0.5,
                px: 1
              }}
            >
              {items.map((item, index) => (
                <LinkedTabs
                  key={index}
                  {...item}
                />
              ))}
            </List>
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                pt: 0.5,
                px: 1
              }}
            >
              <LinkedTabs
                onClick={handleOpen}
                {...bottomItems[0]}
              />
              <ConfirmDialog
                open={isOpen}
                onDisagree={handleClose}
                onAgree={handleAgree}
              />
            </List>
          </Box>
        </Box>
      </Drawer>
      {children}
    </Box>
  );
}

interface TPropsLinkedTabs extends SidebarItems {
  onClick?: () => void;
}

const LinkedTabs = (props: TPropsLinkedTabs) => {
  const { onClick } = props;

  const location = useLocation();
  const path = location.pathname;
  const theme = useTheme();

  const isActive = path === props.directTo;

  return (
    <Link to={props.directTo}>
      <ListItem disablePadding>
        <ListItemButton
          onClick={onClick}
          sx={{
            py: 0.5,
            borderRadius: 1,
            bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : "",
            "&:hover, &:focus": {
              bgcolor: isActive ? alpha(theme.palette.primary.main, 0.18) : ""
            }
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive ? "primary.main" : "",
              p: 0,
              m: 0
            }}
            className="min-w-[45px]"
          >
            {props.icon}
          </ListItemIcon>
          <ListItemText
            sx={{ color: isActive ? "primary.main" : "" }}
            primary={<span className="text-md">{props.label}</span>}
            secondary={props.sublabel ? props.sublabel : ""}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};
