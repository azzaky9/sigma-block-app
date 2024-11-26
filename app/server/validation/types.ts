import * as z from "zod";
import { updateOrderValidation } from "./order.validation";

export type TUpdateOrderValidation = z.infer<typeof updateOrderValidation>;
