import * as React from "react";
import * as z from "zod";
import Stack from "@mui/material/Stack";
import { CategoryWithoutRelational } from "@/types/types";
import Layers from "@mui/icons-material/Layers";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  List,
  ListItem,
  ListItemText,
  Theme,
  Typography,
  useTheme,
  alpha
} from "@mui/material";
import ModifStock from "@/components/Buttons/ModifStock";
import { useInputCategory } from "@/lib/store";
import { useSearchParams } from "@remix-run/react";
import { shortenAlert } from "@/components/Alert/alert";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import CategoriesForm from "@/components/Forms/CategoriesForm";

export const defaultStyleScrollbar = (theme: Theme) => ({
  overflowY: "scroll",
  "&::-webkit-scrollbar": {
    width: "8px" // width of the scrollbar
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.secondary.main, 0.3), // color of the scrollbar handle
    borderRadius: "5px" // roundness of the scrollbar handle
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: theme.palette.primary.main // color of the scrollbar handle on hover
  }
});

export const Category = ({
  id,
  name,
  stock,
  price,
  types,
  stockId,
  specificIdAtSelectedLocation
}: CategoryWithoutRelational) => {
  const [params] = useSearchParams();
  const remove = useInputCategory((state) => state.remove);
  const keepToDeletingRecord = useInputCategory(
    (state) => state.addToDeletingRecord
  );

  const handleRemove = () => {
    const isEditting = params.get("editor_open");
    if (!!isEditting && types === "original") {
      if (stockId && specificIdAtSelectedLocation) {
        keepToDeletingRecord(stockId, specificIdAtSelectedLocation);
      } else {
        shortenAlert("warning", "Unsuspicious thing happen, try again later.");
      }
    }

    remove(id);
  };
  return (
    <ListItem>
      <ListItemText
        primary={name}
        secondary={
          <ModifStock
            id={id}
            stock={stock}
            price={price}
            handleRemove={handleRemove}
          />
        }
      />
    </ListItem>
  );
};

export const OldCategoryInputCollection = () => {
  const theme = useTheme();
  const categories = useInputCategory((state) => state.categories);

  const scrollbarStyles = React.useMemo(
    () => defaultStyleScrollbar(theme),
    [theme]
  );

  return (
    <List
      sx={() => ({
        width: "100%",
        height: 300,
        ...scrollbarStyles
      })}
    >
      {categories.map((ctg) => (
        <Category
          {...ctg}
          specificIdAtSelectedLocation={ctg.specificIdAtSelectedLocation!}
          key={ctg.id}
        />
      ))}
    </List>
  );
};

const ITEMS_SAMPLE_DEV = [
  {
    id: "1",
    name: "Category 1",
    stock: 10,
    price: 1000,
    subCategory: [
      {
        id: "1.1",
        name: "Sub Category 1.1",
        stock: 10,
        price: 1000
      },
      {
        id: "1.2",
        name: "Sub Category 1.2",
        stock: 10,
        price: 1000
      }
    ]
  },
  {
    id: "2",
    name: "Category 2",
    stock: 20,
    price: 2000,
    subCategory: [
      {
        id: "2.1",
        name: "Sub Category 2.1",
        stock: 20,
        price: 2000
      },
      {
        id: "2.2",
        name: "Sub Category 2.2",
        stock: 20,
        price: 2000
      }
    ]
  },
  {
    id: "3",
    name: "Category 3",
    stock: 30,
    price: 3000,
    subCategory: [
      {
        id: "3.1",
        name: "Sub Category 3.1",
        stock: 30,
        price: 3000
      },
      {
        id: "3.2",
        name: "Sub Category 3.2",
        stock: 30,
        price: 3000
      }
    ]
  }
];

export default function ReviewCategory() {
  const categories = useInputCategory((state) => state.categories);

  return (
    <Stack
      sx={{
        h: "100%",
        width: "100%"
      }}
      justifyContent={categories.length === 0 ? "center" : "start"}
      alignItems="center"
    >
      {categories.length === 0 ? (
        <React.Fragment>
          <Layers
            sx={(theme) => ({
              fontSize: 80,
              color: alpha(theme.palette.common.black, 0.4)
            })}
          />
          <Typography
            align="center"
            variant="body2"
          >
            Belum ada category yang di tambahkan.
          </Typography>
        </React.Fragment>
      ) : (
        // <SimpleTreeView
        //   aria-label="Category"
        //   slots={{
        //     expandIcon: ChevronRightIcon,
        //     collapseIcon: ExpandMoreIcon
        //   }}
        //   sx={{
        //     marginTop: 4,
        //     flexGrow: 1,
        //     gap: 1,
        //     paddingLeft: 1,
        //     width: "100%",
        //     overflowY: "auto",
        //     maxHeight: 350
        //   }}
        // >
        //   {ITEMS_SAMPLE_DEV.map((category) => (
        //     <TreeItem
        //       key={category.id}
        //       itemId={category.id}
        //       sx={{ mt: 2 }}
        //       label={
        //         <ModifStock
        //           name={category.name}
        //           id={category.id}
        //           stock={category.stock}
        //           price={category.price}
        //           handleRemove={() => console.log("remove")}
        //         />
        //       }
        //     >
        //       {category.subCategory.map(({ id, stock, price }) => (
        //         <TreeItem
        //           itemId={id}
        //           key={id}
        //           label={
        //             <ModifStock
        //               name={category.name}
        //               id={id}
        //               stock={stock}
        //               price={price}
        //               handleRemove={() => console.log("remove")}
        //             />
        //           }
        //         />
        //       ))}
        //     </TreeItem>
        //   ))}
        // </SimpleTreeView>
        <CategoriesForm />
      )}
    </Stack>
  );
}
