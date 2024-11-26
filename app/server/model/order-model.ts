import * as z from "zod";
import prisma from "@/database/db";
import {
  deleteOrderValidation,
  createOrderValidation
} from "../validation/base";
import { insertZeroIfUndefined } from "../helper/insertzero";

type TDataGetOrder = {
  id: string;
};

export const getOrder = async ({ id }: TDataGetOrder) => {
  const result = await prisma.order.findUnique({
    where: {
      id
    },
    include: {
      product_order: {
        include: {
          category_orders: {
            select: {
              id: true,
              category_id: true,
              get_from_location_id: true,
              total_stock_category: true
            }
          }
        }
      }
    }
  });

  return result;
};

type TDataDeleteOrder = Omit<z.infer<typeof deleteOrderValidation>, "location">;

export const deleteOrderById = async ({ id }: TDataDeleteOrder) => {
  await prisma.order.delete({ where: { id } });
};

export const getOrderById = async () => {
  const result = await prisma.order.findUnique({
    where: {
      id: ""
    },
    select: {}
  });
};

interface TDataCreateOrder extends z.infer<typeof createOrderValidation> {
  documentId: number;
  userId: number;
}

export const createOrder = async (
  other: TDataCreateOrder
): Promise<{ id: string }> => {
  const result = await prisma.order.create({
    data: {
      status: "process",
      total_amount: insertZeroIfUndefined(other.amount),
      document_id: other.documentId,
      user_updated_by_id: other.userId,
      customer_id: other.customerId,
      payment_method: other.paymentMethod,
      pricing_variant: other.priceVariant,
      discount_amount: other.paymentInfo ? other.paymentInfo.discAmount : 0,
      discount_percentage: other.paymentInfo
        ? other.paymentInfo.discPercent
        : 0,
      tax_amount: other.paymentInfo ? other.paymentInfo.taxAmount : 0,
      tax_percentage: other.paymentInfo ? other.paymentInfo.taxPercent : 0
    },
    select: {
      id: true
    }
  });

  return result;
};

export const getProductOrder = async ({ id }: TDataGetOrder) => {
  const result = await prisma.productOrder.findUnique({
    where: {
      id
    }
  });
};

export const getProductOrderWithCategory = async ({ id }: TDataGetOrder) => {
  const result = await prisma.productOrder.findUnique({
    where: {
      id
    },
    include: {
      category_orders: true
    }
  });

  return result;
};
