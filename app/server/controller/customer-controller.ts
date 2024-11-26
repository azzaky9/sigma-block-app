import * as z from "zod";
import { Context } from "../context";
import { createCustomerValidation } from "../validation/base";
import { updateCustomerValidation } from "../validation/customer.validation";
import { Customer } from "@prisma/client";

export type CustomerResponse = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
};
type TCreateCustomer = z.infer<typeof createCustomerValidation>;
type TUpdateCustomer = z.infer<typeof updateCustomerValidation>;

type CustomerControllerOptions = {
  get: (search: string) => Promise<CustomerResponse[]>;
  create: (customerData: TCreateCustomer) => Promise<Customer>;
  update: (updatedData: TUpdateCustomer) => Promise<void>;
};

export const customer = (ctx: Context): CustomerControllerOptions => {
  return {
    update: async ({ id, ...customerData }) => {
      await ctx.prisma.customer.update({
        data: customerData,
        where: {
          id
        }
      });
    },
    create: async (customerData) => {
      return await ctx.prisma.customer.create({
        data: customerData
      });
    },
    get: async (search) => {
      const searchResult = await ctx.prisma.customer.findMany({
        where: {
          full_name: {
            contains: search
          }
        },
        orderBy: {
          full_name: "asc"
        },
        select: {
          id: true,
          full_name: true,
          phone: true,
          email: true,
          address: true,
          orders: {
            select: {
              product_order: {
                select: {
                  _count: true
                }
              }
            }
          }
        }
      });

      const formatResult = searchResult
        .filter((result) => result.orders.length > 0)
        .map(
          ({ id, full_name, email, address, ...other }): CustomerResponse => {
            return {
              id,
              name: full_name,
              email: email || "",
              address: address || "",
              ...other
            };
          }
        );

      return formatResult;
    }
  };
};
