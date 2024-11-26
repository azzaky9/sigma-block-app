import * as z from "zod";
import { createOrderValidation, orderedProduct } from "./base";

export const updateOrderValidation = createOrderValidation.extend({
  id: z.string(),
  invoiceId: z.number().optional(),
  newRecord: orderedProduct,
  deletedRecord: z.array(z.object({ id: z.string().min(1).trim() }))
});
