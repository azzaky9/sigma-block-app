import { Form as PaymentInfoStruct } from "@/components/Forms/FillPaymentInput";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
// import { Form as PaymentInfoStruct } from "@/components/Forms/";

export interface GlobalInformationPayment extends PaymentInfoStruct {
  totalAmount: number;
}

type ReviewProductState = {
  isOpen: boolean;
  dataDisplay: any[];
  formData: GlobalInformationPayment | null;
};

type ReviewProductAction = {
  open: () => void;
  close: () => void;
  setFormData: (data: GlobalInformationPayment) => void;
};

const useFormOrderControlStore = create<
  ReviewProductState & ReviewProductAction
>()(
  immer((set) => ({
    dataDisplay: [],
    isOpen: false,
    formData: null,
    setFormData: (data) =>
      set((state) => {
        state.formData = data;
      }),
    open: () =>
      set((state) => {
        state.isOpen = true;
      }),
    close: () =>
      set((state) => {
        state.isOpen = false;
      })
  }))
);

export { useFormOrderControlStore };
