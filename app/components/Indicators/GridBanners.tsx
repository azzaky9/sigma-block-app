import { Box, Typography } from "@mui/material";
import { trpc } from "@/utils/trpc-client";
import { blue, cyan, red } from "@mui/material/colors";
import TrendingUp from "@mui/icons-material/TrendingUp";
import AddLocationAlt from "@mui/icons-material/AddLocationAlt";
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";
import Banner, {
  BannerContent,
  BannerHeader,
  BannerLabel
} from "@/components/Card/Banner";

const GridBanners = () => {
  const { data } = trpc.getStatusStockBanner.useQuery("1");

  return (
    <Box sx={{ display: "flex", gap: 3 }}>
      <Banner sx={{ flexGrow: 1 }}>
        <BannerHeader
          Icon={FileUploadOutlined}
          color={blue["700"]}
        >
          <BannerLabel label="Pengeluaran" />
        </BannerHeader>
        <BannerContent>
          <Typography variant="h6">
            {data ? data.productInsertedToday : 0}
          </Typography>
        </BannerContent>
      </Banner>

      <Banner sx={{ flexGrow: 1 }}>
        <BannerHeader
          Icon={TrendingUp}
          color={red["700"]}
        >
          <BannerLabel label="Pengeluaran" />
        </BannerHeader>
        <BannerContent>
          <Typography variant="h6">{data ? data.spending : 0}</Typography>
        </BannerContent>
      </Banner>

      <Banner sx={{ flexGrow: 1 }}>
        <BannerHeader
          Icon={AddLocationAlt}
          color={cyan["500"]}
        >
          <BannerLabel label="Total Lokasi" />
        </BannerHeader>
        <BannerContent>
          <Typography variant="h6">{data ? data.locationTotal : 0}</Typography>
        </BannerContent>
      </Banner>
    </Box>
  );
};

export default GridBanners;
