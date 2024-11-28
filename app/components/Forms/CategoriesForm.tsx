import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { FieldArray, useFormikContext } from "formik";

import { Button } from "@mui/material";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ControlSubAndCategory from "@/components/Forms/Input/ControlSubAndCategory";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";

import { FormsCreateProduct } from "@/lib/store";
import LoaderButton from "@/components/Buttons/LoaderButton";

const categoryValidation = z.object({
  id: z.string().min(1, "Wajib di isi"),
  name: z.string().min(1, "Wajib di isi"),
  quantity: z.number().min(1, "Minimal 1").default(1),
  price: z.number().min(0, "Tidak boleh nilai negatif").default(0)
});

const nestedArrayValidationSchema = z.object({
  category: z.array(
    categoryValidation.extend({ subCategory: z.array(categoryValidation) })
  )
});

type ReadableCategoryValidation = z.infer<typeof categoryValidation>;
type TNestedItems = z.infer<typeof nestedArrayValidationSchema>;

export default function CategoriesForm() {
  const {
    values,
    handleChange,
    handleBlur,
    isValid,
    submitForm,
    isSubmitting
  } = useFormikContext<FormsCreateProduct & TNestedItems>();

  return (
    <div className="flex flex-col gap-1">
      <FieldArray name="category">
        {({ remove, push }) => (
          <div className="lg:min-w-[550px] w-full grid place-content-end">
            <SimpleTreeView
              disabledItemsFocusable
              disableSelection
              expansionTrigger="iconContainer"
              aria-label="Category"
              slots={{
                expandIcon: ChevronRightIcon,
                collapseIcon: ExpandMoreIcon
              }}
              sx={{
                marginTop: 1,
                flexGrow: 1,
                gap: 1,
                paddingLeft: 1,
                width: "100%",
                backgroundColor: "teal",
                overflowY: "auto",
                height: 350
              }}
            >
              {values.category.length > 0 &&
                values.category.map((cat, index) => (
                  <TreeItem
                    itemId={`category.${index}.item`}
                    sx={{ mt: 2 }}
                    key={index}
                    label={
                      <ControlSubAndCategory
                        itemAttribute={cat}
                        name={`category.${index}`}
                        index={index}
                        isDisabled={isSubmitting}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        removeItem={remove}
                      />
                    }
                  >
                    <FieldArray name={`category.${index}.subCategory`}>
                      {({ remove: removeSub, push: pushSub }) => (
                        <div>
                          {cat.subCategory.length > 0 &&
                            cat.subCategory.map((subCat, subIndex) => (
                              <TreeItem
                                itemId={`subCategory.${subCat.id}.item`}
                                sx={{ mt: 2 }}
                                key={subIndex}
                                label={
                                  <ControlSubAndCategory
                                    itemAttribute={subCat}
                                    name={`category.${index}.subCategory.${subIndex}`}
                                    index={subIndex}
                                    isDisabled={isSubmitting}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    removeItem={removeSub}
                                  />
                                }
                              />
                            ))}
                          <div className=" flex justify-end items-center mx-5 my-3 gap-2">
                            <Button
                              type="button"
                              size="small"
                              variant="contained"
                              disabled={isSubmitting}
                              endIcon={<AddIcon />}
                              onClick={() =>
                                pushSub({
                                  id: uuidv4(),
                                  name: "",
                                  quantity: 1,
                                  price: 0
                                })
                              }
                            >
                              Tambah SubKategory
                            </Button>
                            <Button
                              type="button"
                              size="small"
                              variant="outlined"
                              color="error"
                              className="h-fit"
                              disabled={isSubmitting}
                              endIcon={<DeleteIcon />}
                              onClick={() => remove(index)}
                            >
                              Hapus Semua
                            </Button>
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </TreeItem>
                ))}
            </SimpleTreeView>

            <div className=" flex justify-end items-center mt-4 gap-2">
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                disabled={isSubmitting}
                onClick={() =>
                  push({
                    id: uuidv4(),
                    name: "",
                    quantity: 1,
                    price: 0,
                    subCategory: []
                  })
                }
              >
                Tambah Kategori
              </Button>
              <LoaderButton
                isLoading={isSubmitting}
                onClick={submitForm}
                disabled={!isValid}
                type="submit"
                variant="contained"
              >
                Submit
              </LoaderButton>
            </div>
          </div>
        )}
      </FieldArray>
    </div>
  );
}

export {
  type TNestedItems,
  type ReadableCategoryValidation,
  nestedArrayValidationSchema
};
