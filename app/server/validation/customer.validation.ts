import * as z from "zod";
import { createCustomerValidation } from "./base";

export const updateCustomerValidation = createCustomerValidation.merge(
  z.object({
    id: z.string()
  })
);
