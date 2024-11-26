import * as z from "zod";
import prisma from "@/database/db";
import { categoryValidation } from "../validation/base";

interface TDataValidationCategory
  extends Pick<
    z.infer<typeof categoryValidation>,
    "category_id" | "from_location"
  > {
  order_quantity?: number;
  stock?: number;
}

export type TDataUpdateCategory = {
  data: Omit<TDataValidationCategory, "from_location">[];
  location: string;
};

type Action = "increment" | "decrement" | "set";

export const updateCategory = async (
  { data, location }: TDataUpdateCategory,
  action: Action
) => {
  await prisma.$transaction(
    data.map(({ category_id, order_quantity }, i) =>
      prisma.categoryStockAtLocation.update({
        where: {
          id: category_id,
          AND: {
            location_name: location
          }
        },
        data: {
          stock: {
            [action]: order_quantity
          }
        }
      })
    )
  );
};

export const setCategory = async (data: TDataUpdateCategory) => {
  await updateCategory(data, "set");
};

export const decreaseCategory = async (data: TDataUpdateCategory) => {
  await updateCategory(data, "decrement");
};

export const incrementCategory = async (data: TDataUpdateCategory) => {
  await updateCategory(data, "increment");
};
