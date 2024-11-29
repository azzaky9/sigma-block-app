import { Box } from "@mui/material";
import StockTable from "@/components/Tables/StockTable";
import GridBanners from "@/components/Indicators/GridBanners";
import StockTabeAction from "@/components/Toolbar/StockTableAction";

export default function DashboardStockPage() {
  return (
    <Box
      component="main"
      className="w-full"
    >
      <GridBanners />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 2,
          paddingBottom: 10
        }}
      >
        <StockTabeAction />
        <StockTable />
      </Box>
    </Box>
  );
}
