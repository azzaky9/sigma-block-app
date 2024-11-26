import { orderStatus } from "@prisma/client";

export type CredentialReqBody = {
  username?: string;
  email: string;
  password: string;
};

export interface Products {
  id: number;
  name: string;
  supplier: string | null;
  amount_supplier: number;
  amount: number;
  stock: number;
  created_at: Date | null;
  updated_at: Date | null;
  created_by: number | null;
  created_by_user: CreatedByUser | null;
  category: Category[];
  product_location_id: string;
  product_connection_id?: string;
}

export interface CheckBoxListShipping {
  label: string;
}

export interface Category {
  id: string;
  name: string;
  product_id: number;
  stock: number;
  price: number;
  stockId?: number;
  specificIdAtSelectedLocation?: string;
  types?: "original" | "edit";
}

export interface CreatedByUser {
  id: number;
  username: string;
  last_seen: Date | null;
  email: string;
}

export type ReadonlyReviewCategory = {
  orderedQty: number;
  fromLocation: string;
  name: string;
  price: string;
};

export interface ReadonlyReviewCreatedProduct {
  totalAmount: number;
  productName: string;
  categories: ReadonlyReviewCategory[];
}

export interface CategoryOrders extends Omit<Category, "product_id" | "stock"> {
  atLocationStock: number;
  fromLocation: string;
  orderStock: number;
}

// export interface ProductOrder {
//   name: string;
//   orderedQty?: number;
//   orderCategory: CategoryOrders[];
//   totalAmount: number;
// }

export interface ProductOrder {
  productId: string;
  productConnectionId: string;
  name: string;
  qty?: number;
  price?: number;
  totalAmount: number;
  orderCategory: CategoryOrders[];
}

export interface OrderTableData {
  id: string;
  invoiceId: number;
  customer: {
    id?: string;
    fullName?: string;
    phone?: string;
    address?: string;
    company?: string;
    email?: string;
  };
  admin: string;
  status: orderStatus;
  createdAt: string;
  totalAmountsOrder: string;
  paymentMethod: string;
  products: ProductOrder[];
}

export type CompanyData = {
  name: string;
  phone: string;
  address: string;
  admin: string;
};

export interface CustomerData extends Omit<CompanyData, "admin"> {
  company: string;
  email: string;
}

export type TransactionData = {
  subtotal: number;
  disc: number;
  tax: number;
  totalTax: number;
  total: number;
  rest: number;
};

export type OrderRenderedData = {
  name: string;
  description: string;
  quantity: string;
  stn: string;
  price: string;
  disc: string;
  tax: string;
  totalAmount: string;
};

export type RequestGenerateInvoice = {
  companyData: CompanyData;
  customerData: CustomerData;
  invoiceNumber: string;
  transaction: TransactionData;
  orderData: OrderRenderedData[];
};

export interface OrderTableDocument {
  id: string;
  name: string;
  qty: string;
  price: string;
  subTotal: string;
}
export interface RequestLetterShipping {
  clientName: string;
  admin: string;
  totalAmount: string;
  priceWords: string;
  noInvoice: string;
  shippingTo: string;
  products: OrderTableDocument[];
}

export type CategoryWithoutRelational = Omit<Category, "product_id">;
