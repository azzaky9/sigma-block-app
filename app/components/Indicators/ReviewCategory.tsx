import Stack from "@mui/material/Stack";
import { alpha, Theme } from "@mui/material";
import { useInputCategory } from "@/lib/store";
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

// export const Category = ({
//   id,
//   name,
//   stock,
//   price,
//   types,
//   stockId,
//   specificIdAtSelectedLocation
// }: CategoryWithoutRelational) => {
//   const [params] = useSearchParams();
//   const remove = useInputCategory((state) => state.remove);
//   const keepToDeletingRecord = useInputCategory(
//     (state) => state.addToDeletingRecord
//   );

//   const handleRemove = () => {
//     const isEditting = params.get("editor_open");
//     if (!!isEditting && types === "original") {
//       if (stockId && specificIdAtSelectedLocation) {
//         keepToDeletingRecord(stockId, specificIdAtSelectedLocation);
//       } else {
//         shortenAlert("warning", "Unsuspicious thing happen, try again later.");
//       }
//     }

//     remove(id);
//   };
//   return (
//     <ListItem>
//       <ListItemText
//         primary={name}
//         secondary={
//           <ModifStock
//             id={id}
//             stock={stock}
//             price={price}
//             handleRemove={handleRemove}
//           />
//         }
//       />
//     </ListItem>
//   );
// };

// export const OldCategoryInputCollection = () => {
//   const theme = useTheme();
//   const categories = useInputCategory((state) => state.categories);

//   const scrollbarStyles = React.useMemo(
//     () => defaultStyleScrollbar(theme),
//     [theme]
//   );

//   return (
//     <List
//       sx={() => ({
//         width: "100%",
//         height: 300,
//         ...scrollbarStyles
//       })}
//     >
//       {categories.map((ctg) => (
//         <Category
//           {...ctg}
//           specificIdAtSelectedLocation={ctg.specificIdAtSelectedLocation!}
//           key={ctg.id}
//         />
//       ))}
//     </List>
//   );
// };

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
      <CategoriesForm />
    </Stack>
  );
}
