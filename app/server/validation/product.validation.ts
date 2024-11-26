import * as z from "zod";
import { Categories, Category as c, CreateProduct as cp } from "./base";

export const updateProductValidation = cp
  .omit({ id: true, category: true })
  .extend({
    id: z.number().min(1),
    category: z.array(
      c.extend({
        id: z.number(),
        stockId: z.number().optional(),
        stockLocationId: z.number().optional()
      })
    ),
    newRecord: Categories,
    deletedRecord: z.array(
      z.object({ stockId: z.number(), stockLocationId: z.string() })
    ),
    locationName: z.string()
  });

export type TUpdateProduct = z.infer<typeof updateProductValidation>;
