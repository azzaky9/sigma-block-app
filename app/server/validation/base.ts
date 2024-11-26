import * as z from "zod";

const ROLE = ["admin", "user"] as const;
const userRole = z.enum(ROLE);
const ORIGIN_PRODUCT = ["production", "purchase"] as const;

// VT for validation types
const Admin = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  role: userRole
});
const OmitEmail = Admin.omit({ email: true });
const EditAdmin = OmitEmail.extend({
  id: z.number()
});
const editUserSetting = z
  .object({ id: z.number() })
  .merge(Admin.omit({ role: true, password: true }));
export const Category = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number()
});

export const Categories = z.array(Category);
const CreateProduct = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Nama barang wajib di isi" }),
  amountSupplier: z.string(),
  supplier: z.string().optional(),
  amount: z.string().optional().default("0"),
  stock: z.number().min(1, { message: "Stock barang wajib di isi" }),
  location: z
    .string()
    .min(1, { message: "Lokasi barang setidaknya di pilih 1" }),
  origin: z.enum(ORIGIN_PRODUCT).default("purchase"),
  category: Categories
});
export const CategoryWithId = z.array(
  Category.merge(z.object({ id: z.number() }))
);
export const UpdateProduct = CreateProduct.omit({ category: true })
  .merge(z.object({ category: CategoryWithId }))
  .partial();
const findById = EditAdmin.pick({ id: true }).merge(
  CreateProduct.pick({ location: true })
);
const categoriesClient = Category.merge(
  z.object({ ctgStockLocationId: z.number(), ctgStockId: z.number() })
);
const VerifyDuplicate = Admin.pick({ username: true, email: true }).partial();
const transferProduct = z.object({
  id: z.number(),
  previousStock: z.array(categoriesClient),
  transferStock: z.array(categoriesClient),
  fromLocation: z.string(),
  toLocation: z.string()
});

export const idValidationOrder = z.object({ id: z.string() });
export const deleteOrderValidation = idValidationOrder.merge(
  z.object({
    location: z.string()
  })
);
export const updateStatusValidation = idValidationOrder.extend({
  status: z.enum(["success", "process"] as const)
});
export const categoryValidation = z.object({
  category_id: z.number(),
  from_location: z.string().min(1),
  order_quantity: z.number(),
  // this property is useful for edit
  stock: z.number().optional()
});

export const orderedCategory = z.array(categoryValidation);

export const productValidation = z.object({
  product_connection_id: z.string().trim().min(1),
  product_id: z.number(),
  total_amount: z.number(),
  categories: orderedCategory
});

export const orderedProduct = z.array(productValidation);

export const createCustomerValidation = z.object({
  full_name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().optional(),
  address: z.string().optional(),
  company: z.string().min(3)
});

export const createOrderValidation = createCustomerValidation.merge(
  z.object({
    customerId: z.string().optional(),
    amount: z.number().optional(),
    paymentMethod: z.string().min(1),
    priceVariant: z.string().min(1),
    paymentInfo: z
      .object({
        taxAmount: z.number(),
        taxPercent: z.number(),
        discAmount: z.number().optional().default(0),
        discPercent: z.number().optional().default(0)
      })
      .optional(),
    orders: orderedProduct
  })
);

export const updateCompanyProfile = z.object({
  id: z.number(),
  name: z.string().trim().optional(),
  tel: z.string().trim().optional(),
  address: z.string().trim().optional()
});
export const findCategoryStockOrder = z.object({
  categoryIds: z.array(z.number()),
  location: z.string()
});
export const customerDataStructure = createOrderValidation.pick({
  full_name: true,
  address: true,
  email: true,
  phone: true,
  company: true
});

type VTValidationOrder = z.infer<typeof idValidationOrder>;
type VTAdminSchema = z.infer<typeof Admin>;
type VTEditSchema = z.infer<typeof EditAdmin>;
type VTDuplicationChecker = z.infer<typeof VerifyDuplicate>;
type VTCreateProduct = z.infer<typeof CreateProduct>;
type VTTransferProduct = z.infer<typeof transferProduct>;
export {
  Admin,
  editUserSetting,
  EditAdmin,
  VerifyDuplicate,
  CreateProduct,
  findById,
  transferProduct,
  type VTTransferProduct,
  type VTValidationOrder,
  type VTCreateProduct,
  type VTAdminSchema,
  type VTEditSchema,
  type VTDuplicationChecker
};
