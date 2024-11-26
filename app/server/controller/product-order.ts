import * as z from "zod";
import prisma from "@/database/db";
import { createOrderValidation } from "../validation/base";
import { Context } from "@/routes/api/context";
import { ProductOrder, OrderCategoryList } from "@prisma/client";
import { updateOrderValidation } from "../validation/order.validation";
import { decreaseCategory, setCategory } from "../model/category-model";
import { restoreCategory } from "./category-controller";

type RequestOrderData = z.infer<typeof createOrderValidation>;
type UpdateOrderData = z.infer<typeof updateOrderValidation>;

type TDataDeleteProductAndCategory = {
  deletedRecords: UpdateOrderData["deletedRecord"];
  orderId: string;
};

type ProductOrderControllerOptions = {
  createProductAndCategory: (
    order: RequestOrderData["orders"][0],
    orderId: any
  ) => Promise<Partial<ProductOrder & OrderCategoryList>>;
  updateProductAndCategory: (
    updatedProduct: UpdateOrderData["orders"]
  ) => Promise<void>;
  deleteProductAndCategory: (
    deletedRecord: TDataDeleteProductAndCategory
  ) => Promise<void>;
};

export const productOrder = (ctx: Context): ProductOrderControllerOptions => {
  return {
    deleteProductAndCategory: async ({ deletedRecords, orderId }) => {
      await Promise.all(
        deletedRecords.map(async ({ id }) => {
          const foundOrder = await ctx.prisma.productOrder.findUnique({
            where: {
              id
            },
            include: {
              category_orders: true
            }
          });
          if (foundOrder)
            restoreCategory({
              orderId,
              insertedData: foundOrder.category_orders.map(
                ({
                  category_id,
                  get_from_location_id,
                  total_stock_category
                }) => ({
                  category_id,
                  get_from_location_id,
                  total_stock_category
                })
              )
            });
          return ctx.prisma.productOrder.delete({
            where: { id }
          });
        })
      );
    },
    updateProductAndCategory: async (orders) => {
      await Promise.all(
        orders.map(async (order) => {
          const updatedCategoriesData = order.categories.map((category) => ({
            where: {
              category_id: category.category_id,
              order_id: order.product_connection_id
            },
            data: {
              total_stock_category: category.order_quantity,
              get_from_location_id: category.from_location
            }
          }));

          await setCategory({
            data: order.categories.map((ord) => ({
              ...ord,
              order_quantity: ord.stock
            })),
            location: order.categories[0].from_location
          });
          await prisma.productOrder.update({
            where: { id: order.product_connection_id },
            data: {
              product_id: order.product_id,
              total_amount: order.total_amount,
              category_orders: {
                updateMany: updatedCategoriesData
              }
            }
          });
        })
      );
    },
    createProductAndCategory: async (order, orderId: any) => {
      const createdProductOrder = await prisma.productOrder.create({
        data: {
          product_id: order.product_id,
          total_amount: order.total_amount,
          order_id: orderId,
          category_orders: {
            createMany: {
              data: order.categories
                .filter((a) => a.order_quantity > 0)
                .map((category) => ({
                  total_stock_category: category.order_quantity,
                  category_id: category.category_id,
                  get_from_location_id: category.from_location
                }))
            }
          }
        }
      });

      if (order.categories.length > 0) {
        await decreaseCategory({
          data: order.categories,
          location: order.categories[0].from_location
        });
      }
      return createdProductOrder;
    }
  };
};

export { type UpdateOrderData };
