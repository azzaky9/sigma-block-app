import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { FieldArray, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { Button } from "@mui/material";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ModifStock from "@/components/Buttons/ModifStock";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";

const categoryValidation = z.object({
  id: z.string().min(1, "Id invalid, wajib di isi"),
  name: z.string().min(1, "Nama category wajib di isi"),
  quantity: z.number().min(1, "Kuantitas minimal >= 1").default(1),
  price: z.number().min(0, "Harga tidak boleh negatif").default(0)
});

const nestedArrayValidationSchema = z.object({
  category: z.array(
    categoryValidation.extend({ subCategory: z.array(categoryValidation) })
  )
});

type ReadableCategoryValidation = z.infer<typeof categoryValidation>;
type TNestedItems = z.infer<typeof nestedArrayValidationSchema>;

export default function CategoriesForm() {
  return (
    <div className="flex flex-col gap-1">
      <Formik
        initialValues={{ category: [] } as TNestedItems}
        validationSchema={toFormikValidationSchema(nestedArrayValidationSchema)}
        onSubmit={(value) => console.log(value)}
      >
        {({
          values,
          handleChange,
          handleBlur,
          // setFieldValue,
          handleSubmit
        }) => (
          <form onSubmit={handleSubmit}>
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
                            <ModifStock
                              itemAttribute={cat}
                              name={`category.${index}`}
                              index={index}
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
                                      itemId={`subCateory.${subCat.id}.item`}
                                      sx={{ mt: 2 }}
                                      key={subIndex}
                                      label={
                                        <ModifStock
                                          itemAttribute={subCat}
                                          name={`subCategory.${subIndex}`}
                                          index={subIndex}
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
                    <Button
                      type="submit"
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </FieldArray>
          </form>
        )}
      </Formik>
    </div>
  );
}

export { type TNestedItems, type ReadableCategoryValidation };
