import { Box } from "@mui/material";
import StockTable from "@/components/Tables/StockTable";
import GridBanners from "@/components/Indicators/GridBanners";
import StockBottomToolbar from "@/components/Toolbar/StockBottomToolbar";

export default function DashboardStockPage() {
  return (
    <main className="w-full">
      <Box sx={{ px: 1, py: 5 }}>
        <Box sx={{ flexGrow: 1, mb: 3 }}>
          <GridBanners />
        </Box>
        <div className="flex flex-col">
          <StockBottomToolbar />
          <StockTable />
        </div>
      </Box>
    </main>
  );
}
