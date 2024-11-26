import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import type { TUpdateOrderValidation } from "../validation/types";
import { customer } from "./customer-controller";
import { productOrder } from "./product-order";

type OrderControllerOptions = {
  update: (requestData: TUpdateOrderValidation) => Promise<void>;
};

export const order = (ctx: Context): OrderControllerOptions => {
  return {
    update: async (requestData: TUpdateOrderValidation) => {
      const {
        deletedRecord,
        newRecord: newRecords,
        full_name,
        email,
        phone,
        company,
        customerId,
        orders,
        address,
        amount,
        paymentMethod,
        id
      } = requestData;

      const customerData = {
        full_name,
        email,
        phone,
        address,
        company
      }

      try {
        const productOrderController = productOrder(ctx);
        await ctx.prisma.$transaction(async (prisma) => {
          if (newRecords.length > 0) {
            await Promise.all(newRecords.map(record => productOrderController.createProductAndCategory(record, id)));
          }

          if (deletedRecord.length > 0) {
            await productOrderController.deleteProductAndCategory({ deletedRecords: deletedRecord, orderId: id });
          }

          if (!!customerId) {
            await customer(ctx).update({ ...customerData, id: customerId });
          }

          await prisma.order.update({
            where: { id },
            data: { total_amount: amount, payment_method: paymentMethod, user_updated_by_id: ctx.session.user.id }
          });

          await productOrderController.updateProductAndCategory(orders);
        });
      } catch (e) {
        if (e instanceof Error) {
          console.error(e);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
          });
        }
      }
    }
  };
};
