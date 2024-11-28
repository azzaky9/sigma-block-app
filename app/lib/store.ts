import * as z from "zod";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { CategoryWithoutRelational } from "@/types/types";
import { VTCreateProduct, orderedProduct } from "@/server/validation/base";
import { Form as CustomerFormStruct } from "@/components/Forms/CreateOrderForm";
import { TUpdateProduct } from "@/server/validation/product.validation";
import { type UpdateOrderData } from "@/server/controller/product-order";
// short repetitive set state function types
type S<T = unknown, U = any> = (value: T, prices?: U) => void;
interface LocationsStore {
  location: string[];
  selectedLocation: string;
  setSelectedLocation: S<string>;
  set: S<string[]>;
}
const useLocationStore = create<LocationsStore>()((set) => ({
  location: [],
  selectedLocation: "Storage",
  setSelectedLocation: (value) =>
    set((state) => ({ ...state, selectedLocation: value })),
  set: (value) => set((state) => ({ ...state, location: value }))
}));
interface ModalCategoryStore {
  isOpen: boolean;
  open: S;
  close: S;
  categories: CategoryWithoutRelational[];
  setCategories: S<CategoryWithoutRelational[]>;
}
const useModalCategoryStore = create<ModalCategoryStore>()((set) => ({
  isOpen: false,
  open: () => set((state) => ({ ...state, isOpen: true })),
  close: () => set((state) => ({ ...state, isOpen: false })),
  categories: [],
  setCategories: (value) => set((state) => ({ ...state, categories: value }))
}));

export type FormsCreateProduct = Omit<VTCreateProduct, "category">;

export interface ProductForm
  extends Pick<ModalCategoryStore, "categories" | "setCategories"> {
  formData: FormsCreateProduct;
  deletedRecord: TUpdateProduct["deletedRecord"];
  isFormOpen: boolean;
  handleFormOpen: () => void;
  handleFormClose: () => void;
  addToDeletingRecord: (stockId: number, stockLocationId: string) => void;
  setFormData: S<FormsCreateProduct>;
  add: S<CategoryWithoutRelational>;
  remove: S<string>;
  inc: S<string>; // string as ID;
  dec: S<string>; // string as ID;
  updatePrice: S<string, number>; // number as ID
  cleanup: () => void;
}
export interface TransferStock {
  id: number | null;
  setId: S<number | null>;
}

const updateStockCategory = (
  id: string,
  prevCtg: CategoryWithoutRelational[],
  mode: "inc" | "dec"
) => {
  const updatedState = prevCtg.map((ctg) => {
    if (ctg.id === id) {
      return {
        ...ctg,
        stock:
          mode === "inc"
            ? ctg.stock + 1
            : ctg.stock !== 1
            ? ctg.stock - 1
            : ctg.stock
      };
    }

    return { ...ctg };
  });

  return updatedState;
};
const updateStockPrice = (
  id: string,
  newPrice: number,
  prevCtg: CategoryWithoutRelational[]
) => {
  const updatedState = prevCtg.map((ctg) => {
    if (ctg.id === id) {
      return {
        ...ctg,
        price: newPrice
      };
    }

    return { ...ctg };
  });

  return updatedState;
};
const useTransferStock = create<TransferStock>()((set) => ({
  id: null,
  setId: (value) => set((state) => ({ ...state, id: value }))
}));
const useInputCategory = create<ProductForm>()(
  immer((set) => ({
    formData: {
      name: "",
      amountSupplier: "",
      amount: "",
      stock: 0,
      location: "Storage",
      origin: "purchase"
    },
    deletedRecord: [],
    addToDeletingRecord: (stockId, stockLocationId) => {
      set((state) => {
        state.deletedRecord.push({ stockId, stockLocationId });
      });
    },
    isFormOpen: false,
    handleFormClose: () => set((state) => ({ ...state, isFormOpen: false })),
    handleFormOpen: () => set((state) => ({ ...state, isFormOpen: true })),
    categories: [],
    setFormData: (value) => set((state) => ({ ...state, formData: value })),
    setCategories: (value) => set((state) => ({ ...state, categories: value })),
    add: (value) =>
      set((state) => ({ ...state, categories: [value, ...state.categories] })),
    remove: (value) =>
      set((state) => ({
        ...state,
        categories: [...state.categories].filter((ctg) => ctg.id !== value)
      })),
    inc: (id) =>
      set((state) => ({
        ...state,
        categories: updateStockCategory(id, [...state.categories], "inc")
      })),
    dec: (id) =>
      set((state) => ({
        ...state,
        categories: updateStockCategory(id, [...state.categories], "dec")
      })),
    updatePrice: (id, prices) =>
      set((state) => ({
        ...state,
        categories: updateStockPrice(id, prices ? prices : 0, [
          ...state.categories
        ])
      })),
    cleanup: () =>
      set((state) => ({
        ...state,
        formData: {
          ...state.formData,
          amount: "",
          amountSupplier: "",
          name: "",
          stock: 0
        },
        categories: [],
        deletedRecord: []
      }))
  }))
);

export type TAB_OPTION = "register" | "order";
export type TOrderProduct = z.infer<typeof orderedProduct>;
type ClientCategory = TOrderProduct[0]["categories"][0];

interface InteractiveCategory extends ClientCategory {
  name: string;
  stock: number;
  maxOrder: number;
  price: number;
  categoryStockInSpecificLocationId: string;
}
// const f: InteractiveCategory ={  }
export type CategoryValue = Omit<InteractiveCategory, "category_id">;
export interface InteractiveOrder extends Omit<TOrderProduct[0], "categories"> {
  name: string;
  type?: "new-record" | "original";
  categories: Record<string, CategoryValue>;
}

type HashIdListLocation = boolean;
type OrderStoreState = {
  currentTab: TAB_OPTION;

  deletedRecord: { id: string }[];
  order: InteractiveOrder[];
  customerData: CustomerFormStruct | null;
  hashSelectedProduct: Record<string, HashIdListLocation | undefined>;
};
export type ProduceIncrementAction = {
  categoryId: string;
  productId: number;
};
type OrderActions = {
  inc: (
    updatedIds: ProduceIncrementAction,
    value: number,
    isEdit?: boolean
  ) => void;
  dec: (
    updatedIds: ProduceIncrementAction,
    value: number,
    isEdit?: boolean
  ) => void;
  remove: (
    id: number,
    addToDeletedRecord?: boolean,
    recordCredential?: string
  ) => void;
  add: (value: InteractiveOrder) => void;
  setCurrentTab: (value: TAB_OPTION) => void;
  setOrder: (value: InteractiveOrder[]) => void;
  setCustomerData: (value: CustomerFormStruct) => void;
  setTotalAmount: (id: number, value: number) => void;
  cleanup: () => void;
};
const initialValuesCsData = {
  customerId: "",
  invoiceId: 0,
  full_name: "",
  phone: "",
  email: "",
  address: "",
  company: "",
  paymentMethod: "Cash",
  priceVariant: "normal",
  paymentInfo: {
    discAmount: 0,
    discPercent: 0,
    taxAmount: 0,
    taxPercent: 0
  }
};
const useGlobalControlOrder = create<OrderStoreState & OrderActions>()(
  immer((set) => ({
    order: [],
    deletedRecord: [],
    customerData: initialValuesCsData,
    hashSelectedProduct: {},
    setTotalAmount: (id, value) => {
      set((state) => {
        const findIndex = state.order.findIndex((ord) => ord.product_id === id);

        if (findIndex !== -1) {
          state.order[findIndex].total_amount = value;
        }
      });
    },
    setCustomerData: (value) =>
      set((state) => {
        state.customerData = value;
      }),
    currentTab: "register" as const,
    inc: ({ productId, categoryId }, value, isEdit) => {
      set((state) => {
        const findIndex = state.order.findIndex(
          (ord) => ord.product_id === productId
        );
        const categoryToUpdate = state.order[findIndex].categories[categoryId];

        if (findIndex !== -1) {
          if (isEdit) {
            state.order[findIndex].categories[categoryId].stock -= 1;
          }
          // state.order[findIndex].total_amount += categoryToUpdate.price * value;
          categoryToUpdate.order_quantity = value;
        }
      });
    },
    dec: ({ categoryId, productId }, value, isEdit) =>
      set((state) => {
        const findIndex = state.order.findIndex(
          (ord) => ord.product_id === productId
        );

        if (findIndex !== -1) {
          if (isEdit) {
            state.order[findIndex].categories[categoryId].stock += 1;
          }
          state.order[findIndex].categories[categoryId].order_quantity = value;
        }
      }),
    remove: (id, addToDeletedRecord, recordCredential) =>
      set((state) => {
        const index = state.order.findIndex((ord) => ord.product_id === id);
        if (index !== -1) {
          delete state.hashSelectedProduct[id];
          state.order.splice(index, 1);
        }
        if (!!addToDeletedRecord && !!recordCredential) {
          state.deletedRecord.push({ id: recordCredential });
        }
      }),
    add: (value) =>
      set((state) => {
        state.hashSelectedProduct[value.product_id] = true;
        state.order.unshift(value);
      }),
    setCurrentTab: (value) => set((state) => ({ ...state, currentTab: value })),
    setOrder: (value) => set((state) => ({ ...state, order: value })),
    cleanup: () =>
      set((state) => {
        state.order = [];
        state.deletedRecord = [];
        state.hashSelectedProduct = {};
        state.customerData = initialValuesCsData;
      })
  }))
);

type EdpState = {
  newRecord: UpdateOrderData["newRecord"];
  deletedRecord: UpdateOrderData["deletedRecord"];
};

type EdpActions = {
  smapleAction: () => void;
};

const useEditProductOrder = create<EdpState & EdpActions>()(
  immer((set, get) => ({
    newRecord: [],
    deletedRecord: [],
    smapleAction: () => {
      const {} = get();
    }
  }))
);
export {
  useGlobalControlOrder,
  useLocationStore,
  useModalCategoryStore,
  useInputCategory,
  useTransferStock,
  useEditProductOrder
};
