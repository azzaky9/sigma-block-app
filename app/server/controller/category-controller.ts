import { Context } from "../context";
import { TDataUpdateCategory, incrementCategory } from "../model/category-model";
import { getOrder } from "../model/order-model";
import { VTCreateProduct } from "../validation/base";
import { OrderCategoryList } from "@prisma/client";

export type ReturnShortenCreatedCategory = {
  id: number;
  name: string;
  product_id: number;
};

type CategoryControllerOptions = {
  create: (
    productData: VTCreateProduct,
    categoryData: ReturnShortenCreatedCategory[]
  ) => Promise<void>;
};

type TDataRestoreCategory = {
  orderId: string;
  insertedData?: Pick<OrderCategoryList, "category_id" | "total_stock_category" | "get_from_location_id">[]
}


export const restoreCategory = async ({ orderId, insertedData }: TDataRestoreCategory) => {
  const recapStock: TDataUpdateCategory["data"] = []
  const foundOrder = await getOrder({ id: orderId })
  let location = ""

  if (foundOrder && !insertedData) {
    const { product_order } = foundOrder
    product_order.forEach((product) => {
      product.category_orders.forEach(({ category_id, total_stock_category, get_from_location_id }) => {
        location = get_from_location_id
        recapStock.push({ category_id: category_id, order_quantity: total_stock_category })
      })
    })

  }

  if (insertedData) {
    insertedData.forEach(({ category_id, total_stock_category, get_from_location_id }) => {
      location = get_from_location_id
      recapStock.push({ category_id: category_id, order_quantity: total_stock_category })
    })
  }

  await incrementCategory({ data: recapStock, location })

}

export const category = (ctx: Context): CategoryControllerOptions => {
  return {
    create: async (productData, categoryData) => {
      const createdctgStock = await Promise.all(
        categoryData.map(async (ctg) =>
          ctx.prisma.categoryStock.create({ data: { category_id: ctg.id } })
        )
      );
      await ctx.prisma.categoryStockAtLocation.createMany({
        data: createdctgStock.map((ctg, i) => ({
          ctg_stock: ctg.id,
          location_name: productData.location,
          stock: productData.category[i].stock,
          price: productData.category[i].price
        }))
      });
    }
  };
};
