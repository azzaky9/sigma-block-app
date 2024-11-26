import Equalizer from "@mui/icons-material/Equalizer";
import Inventory from "@mui/icons-material/Inventory";
import Settings from "@mui/icons-material/Settings";
import ManageAccounts from "@mui/icons-material/ManageAccounts";
import DoorBack from "@mui/icons-material/DoorBack";
import Assignment from "@mui/icons-material/Assignment";

type SidebarItems = {
  icon: JSX.Element;
  label: string;
  sublabel?: string;
  directTo: string;
};

type Sidebars = SidebarItems[];

const items: Sidebars = [
  {
    label: "Pemesanan",
    directTo: "/dashboard",
    icon: <Assignment />
  },

  {
    label: "Stock",
    directTo: "/dashboard/stock",
    icon: <Inventory />
  },
  {
    label: "Analisis",
    directTo: "/dashboard/analitycs",
    icon: <Equalizer />
  },
  {
    label: "Setting",
    directTo: "/dashboard/setting",
    icon: <Settings />
  },
  {
    label: "Staff",
    directTo: "/dashboard/admin",
    icon: <ManageAccounts />
  }
];

const bottomItems: Sidebars = [
  {
    label: "Keluar",
    directTo: "",
    icon: <DoorBack />
  }
];

export { items, bottomItems, type SidebarItems };
