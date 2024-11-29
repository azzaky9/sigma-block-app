import * as z from "zod";
import superjson from "superjson";
import { TRPCError, initTRPC } from "@trpc/server";
import { type Context } from "./context";
import {
  Admin,
  EditAdmin,
  CreateProduct,
  findById,
  transferProduct,
  editUserSetting,
  idValidationOrder,
  updateStatusValidation,
  createOrderValidation,
  customerDataStructure,
  updateCompanyProfile
} from "@/server/validation/base";
import { user as db } from "@/server/service/user";
import {
  OrderTableData,
  Products,
  ProductOrder,
  RequestGenerateInvoice,
  OrderRenderedData
} from "@/types/types";
import moment from "moment";
import { formatCurrency } from "@/server/service/formatCurrency";
import prisma from "@/database/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { CategoryValue, InteractiveOrder } from "@/lib/store";
import { order as orderController } from "@/server/controller/order-controller";
import { updateOrderValidation } from "@/server/validation/order.validation";
import { productOrder } from "@/server/controller/product-order";
import { updateProductValidation } from "@/server/validation/product.validation";
import { product } from "@/server/controller/product-controller";
import { customer } from "@/server/controller/customer-controller";
import {
  category,
  restoreCategory
} from "@/server/controller/category-controller";
import { createOrder, deleteOrderById } from "@/server/model/order-model";
import { internalServerError } from "@/server/helper/internal-server-error";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof z.ZodError
            ? error.cause.flatten()
            : null
      }
    };
  }
});

export const publicProcedure = t.procedure;
export const router = t.router;
export const mergeRouter = t.mergeRouters;

const findOrCreateCustomer = async (
  prisma: PrismaClient,
  customerId?: string,
  customerData?: z.infer<typeof customerDataStructure>
): Promise<string | null> => {
  if (customerId) {
    const foundCustomer = await prisma.customer.findFirstOrThrow({
      where: {
        id: customerId
      },
      select: {
        id: true
      }
    });

    return foundCustomer.id;
  }

  if (customerData) {
    const createdCustomer = await prisma.customer.create({
      data: customerData,
      select: {
        id: true
      }
    });

    return createdCustomer.id;
  }

  return null;
};
const getProduct = async (
  where: Prisma.ProductLocationWhereInput,
  input: string
) => {
  const result = await prisma.productLocation.findMany({
    where: where,
    include: {
      product: {
        include: {
          created_by_user: {
            select: {
              id: true,
              username: true,
              last_seen: true,
              email: true
            }
          },
          product_order: {
            select: {
              id: true
            }
          },
          category: {
            include: {
              stock: {
                select: {
                  id: true,
                  ctg_stock_location: {
                    where: {
                      location_name: input
                    },
                    select: {
                      id: true,
                      price: true,
                      stock: true,
                      location_name: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: { product: { name: "asc" } }
  });

  const deleteRelational = result.map((result): Products => {
    const { product } = result;
    return {
      ...product,
      product_location_id: result.id,
      product_connection_id: result.product.product_order[0]
        ? result.product.product_order[0].id
        : "",
      category: product.category.map((categories) => ({
        ...categories,
        id: String(categories.id),
        stockId:
          !!categories.stock[0] && categories.stock[0].id
            ? categories.stock[0].id
            : undefined,
        specificIdAtSelectedLocation: String(
          !!categories.stock[0] && categories.stock[0].ctg_stock_location[0]
            ? categories.stock[0].ctg_stock_location[0].id
            : undefined
        ),
        price:
          !!categories.stock[0] && categories.stock[0].ctg_stock_location[0]
            ? categories.stock[0].ctg_stock_location[0].price
            : 0,
        stock:
          !!categories.stock[0] && categories.stock[0].ctg_stock_location[0]
            ? categories.stock[0].ctg_stock_location[0].stock
            : 0
      }))
    };
  });

  return deleteRelational;
};

export const appRouter = router({
  ping: publicProcedure.query(async () => {
    return { message: "TRPC Ready to connect.", statusCode: 200 };
  }),
  createAdmin: publicProcedure
    .input(Admin)
    .mutation(async ({ input, ctx }) => await db.create({ data: input }, ctx)),
  getAllAdmin: publicProcedure.query(async ({ ctx }) => await db.getAll(ctx)),
  deleteSelection: publicProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      await db.deleteBySelectionId({ data: input }, ctx);
    }),
  updateProfile: publicProcedure
    .input(editUserSetting)
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      if (!session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please Login when you want to update your profile"
        });
      }

      const updatedProfile = await ctx.prisma.user.update({
        where: {
          id: session.user.id
        },
        data: {
          email: input.email,
          username: input.username
        },
        select: {
          email: true,
          username: true
        }
      });

      return updatedProfile;
    }),
  updateUser: publicProcedure
    .input(EditAdmin)
    .mutation(async ({ ctx, input }) => {
      await db.updateExistingProp({ data: input }, ctx);
    }),
  getExisitingLocation: publicProcedure.query(
    async ({ ctx }) => await ctx.prisma.location.findMany()
  ),
  createLocations: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.location.create({
        data: { location_name: input.name }
      });
    }),
  updateProduct: publicProcedure
    .input(updateProductValidation)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Must be include product id, if you want to creating new product"
        });
      }

      await product(ctx).update(input);
    }),
  createProduct: publicProcedure
    .input(CreateProduct)
    .mutation(async ({ ctx, input }) => {
      const isCategoryExist = input.category.length > 0;
      const { category: createdCategory } = await product(ctx).create(
        input,
        isCategoryExist
      );
      if (isCategoryExist) {
        await category(ctx).create(input, createdCategory);
      }

      return `Complete to add product ${input.name} at location ${input.location}.`;
    }),
  getProductById: publicProcedure
    .input(findById)
    .query(async ({ ctx, input }) => {
      const results = await ctx.prisma.product.findFirst({
        where: {
          id: input.id
        },
        select: {
          name: true,
          stock: true,
          location: true,
          category: {
            include: {
              stock: {
                select: {
                  id: true,
                  category_id: true,
                  ctg_stock_location: {
                    where: {
                      locations: {
                        location_name: input.location
                      }
                    },
                    select: {
                      id: true,
                      stock: true,
                      location_name: true,
                      price: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!input.id || !results) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "cannot find data searching, try with another id's"
        });
      }

      const formatCategory = results.category.map((categories) => ({
        ...categories,
        price:
          categories.stock[0].ctg_stock_location.find(
            (stockAtLocation) => stockAtLocation.price
          )?.price || 0,
        stock:
          categories.stock[0].ctg_stock_location.find(
            (stockAtLocation) => stockAtLocation.stock
          )?.stock || 0,
        ctgStockLocationId: categories.stock[0].ctg_stock_location[0].id,
        ctgStockId: categories.stock[0].id
      }));

      const cleaned = {
        ...results,
        category: formatCategory
      };

      return cleaned;
    }),
  getProducts: publicProcedure.input(String).query(async ({ input }) => {
    return await getProduct({ location_name: input }, input, false);
  }),
  deleteProductById: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.productLocation.delete({ where: { id: input } });
    }),
  transferProduct: publicProcedure
    .input(transferProduct)
    .mutation(async ({ ctx, input }) => {
      try {
        const foundProduct = await ctx.prisma.productLocation.findFirst({
          where: {
            location_name: input.toLocation,
            product_code: input.id
          },
          select: {
            product: {
              select: {
                category: {
                  select: {
                    stock: {
                      include: {
                        ctg_stock_location: {
                          where: {
                            location_name: input.toLocation
                          },
                          select: {
                            id: true,
                            ctg_stock: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });

        if (!foundProduct) {
          const createdProduct = await ctx.prisma.productLocation.create({
            data: {
              location_name: input.toLocation,
              product_code: input.id
            },
            select: { id: true, product_code: true }
          });
        }

        const hashNewValue: { [key: string]: number } = {};
        input.transferStock.forEach((stock) => {
          hashNewValue[stock.ctgStockId] = stock.stock;
        });

        // decrease previous stock first.
        await Promise.all(
          input.previousStock.map(
            async (stock) =>
              await ctx.prisma.categoryStockAtLocation.update({
                data: {
                  stock: {
                    decrement: hashNewValue[stock.ctgStockId] || 0
                  }
                },
                where: {
                  id: stock.ctgStockLocationId,
                  AND: {
                    location_name: input.fromLocation
                  }
                }
              })
          )
        );

        if (!foundProduct) {
          await Promise.all(
            input.transferStock.map(async (stock) => {
              await ctx.prisma.categoryStockAtLocation.create({
                data: {
                  ctg_stock: stock.ctgStockId,
                  stock: stock.stock,
                  location_name: input.toLocation,
                  price: stock.price
                }
              });
            })
          );
        } else {
          await Promise.all(
            foundProduct.product.category.map(async (ctg, index) => {
              await ctx.prisma.categoryStockAtLocation.update({
                data: {
                  stock: {
                    increment:
                      hashNewValue[
                        ctg.stock[index].ctg_stock_location[index].ctg_stock
                      ]
                  }
                },
                where: {
                  id: ctg.stock[index].ctg_stock_location[index].id
                }
              });
            })
          );
        }

        // update new value on another location
      } catch (error) {
        if (error instanceof Error) {
          error.message;
        }
      }
    }),
  searchProduct: publicProcedure.input(String).query(async ({ ctx, input }) => {
    const splittedQuery = input.split("&");

    return await getProduct(
      {
        location_name: splittedQuery[1],
        AND: {
          product: {
            name: {
              contains: splittedQuery[0]
            }
          }
        }
      },
      splittedQuery[1],
      true
    );
  }),
  editOrder: publicProcedure
    .input(updateOrderValidation)
    .mutation(async ({ ctx, input }) => {
      await orderController(ctx).update(input);
    }),
  updateStatusOrder: publicProcedure
    .input(updateStatusValidation)
    .mutation(async ({ ctx, input }) => {
      try {
        const findOrderToUpdate = await ctx.prisma.order.findUniqueOrThrow({
          where: {
            id: input.id
          },
          select: {
            product_order: {
              select: {
                category_orders: true,
                qty: true,
                product_id: true
              }
            }
          }
        });

        findOrderToUpdate.product_order.forEach((ord) => {
          ord.category_orders.forEach(async (catOrders) => {
            if (catOrders.total_stock_category > 0) {
              return await ctx.prisma.categoryStockAtLocation.update({
                where: {
                  id: Number(catOrders.category_id)
                },
                data: {
                  stock: {
                    decrement: catOrders.total_stock_category
                  }
                }
              });
            }
          });
        });

        await ctx.prisma.order.update({
          where: {
            id: input.id
          },
          data: {
            status: input.status
          }
        });
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }),
  createOrder: publicProcedure
    .input(createOrderValidation)
    .mutation(async ({ ctx, input }) => {
      try {
        const { full_name, phone, address, email, company } = input;
        const customerId = await findOrCreateCustomer(
          ctx.prisma,
          input.customerId,
          {
            full_name: full_name ?? "",
            phone: phone ?? "",
            address,
            email,
            company
          }
        );
        const { id: documentId } = await ctx.prisma.document.create({
          data: {
            is_expired: new Date()
          },
          select: {
            id: true
          }
        });

        if (ctx.session.user.id) {
          if (customerId) {
            const userId = ctx.session.user.id;

            const createdOrder = await createOrder({
              ...input,
              documentId,
              customerId,
              userId
            });
            await Promise.all(
              input.orders.map(async (order) => {
                return await productOrder(ctx).createProductAndCategory(
                  order,
                  createdOrder.id
                );
              })
            );
          }
        } else {
          throw new TRPCError({
            code: "UNAUTHORIZED"
          });
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e);

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "Error during creating, try again later.",
            message: "Error during update data, error trigger at server"
          });
        }
      }
    }),
  deleteOrder: publicProcedure
    .input(idValidationOrder)
    .mutation(async ({ input }) => {
      try {
        const { id } = input;
        await restoreCategory({ orderId: id });
        await deleteOrderById({ id });
      } catch (e) {
        if (e instanceof Error) internalServerError(e);
      }
    }),
  getOrderProduct: publicProcedure
    .input(String)
    .query(async ({ ctx, input }): Promise<InteractiveOrder[]> => {
      const result = await ctx.prisma.productOrder.findMany({
        where: {
          order_id: input
        },
        select: {
          id: true,
          total_amount: true,
          product: {
            select: {
              name: true,
              id: true
            }
          },
          category_orders: {
            select: {
              id: true,
              total_stock_category: true,
              get_from_location_id: true,
              categories: {
                select: {
                  stock: true,
                  price: true,
                  ctg: {
                    select: {
                      category: {
                        select: {
                          name: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      return result.map((r) => ({
        product_connection_id: r.id,
        name: r.product.name,
        total_amount: r.total_amount,
        product_id: r.product.id,
        categories: Object.fromEntries(
          r.category_orders.map(({ id, ...other }): [number, CategoryValue] => [
            Number(id),
            {
              name: other.categories.ctg.category.name,
              categoryStockInSpecificLocationId: id,
              from_location: other.get_from_location_id,
              order_quantity: other.total_stock_category,
              price: other.categories.price,
              maxOrder: other.categories.stock + other.total_stock_category,
              stock: other.categories.stock + other.total_stock_category
            }
          ])
        )
      }));
    }),
  getCategoryOrder: publicProcedure
    .input(String)
    .query(async ({ ctx, input }) => {
      const splitQuery = input.split("&");

      const findCategory = await ctx.prisma.category.findFirst({
        where: {
          product_id: Number(splitQuery[0]),
          stock: {
            every: {
              ctg_stock_location: {
                every: {
                  location_name: splitQuery[1]
                }
              }
            }
          }
        },
        select: {
          stock: {
            select: {
              ctg_stock_location: {
                select: {
                  id: true,
                  price: true,
                  stock: true
                }
              }
            }
          }
        }
      });

      return findCategory;
    }),
  findPreviouseCustomer: publicProcedure
    .input(String)
    .query(async ({ ctx, input }) => {
      return await customer(ctx).get(input);
    }),
  getOrders: publicProcedure
    .input(String)
    .query(async ({ ctx, input }): Promise<OrderTableData[]> => {
      const startDate = moment(input).startOf("day").toDate();
      const endDate = moment(input).endOf("day").toDate();

      const orders = await ctx.prisma.order.findMany({
        where: {
          created_at: {
            gt: startDate,
            lt: endDate
          }
        },
        select: {
          total_amount: true,
          updated_by: {
            select: {
              username: true
            }
          },
          payment_method: true,
          created_at: true,
          customer: {
            select: {
              email: true,
              id: true,
              full_name: true,
              phone: true,
              address: true
            }
          },
          product_order: {
            select: {
              id: true,
              category_orders: {
                select: {
                  id: true,
                  get_from_location_id: true,
                  total_stock_category: true,
                  categories: {
                    select: {
                      id: true,
                      location_name: true,
                      stock: true,
                      price: true,
                      ctg: {
                        select: {
                          category: {
                            select: {
                              name: true
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              qty: true,
              total_amount: true,
              product: {
                select: {
                  name: true,
                  amount: true,
                  id: true
                }
              }
            }
          },
          document_id: true,
          id: true,
          status: true
        }
      });

      const formattedProducts = (order: (typeof orders)[0]) => {
        return order.product_order.map(
          (p): ProductOrder => ({
            productConnectionId: p.id,
            productId: String(p.product.id),
            name: p.product.name,
            price: p.product.amount,
            totalAmount: p.total_amount,
            qty: p.qty,
            orderCategory: p.category_orders.map(
              ({ id, categories: c, total_stock_category: qty }) => ({
                id,
                specificIdAtSelectedLocation: String(c.id),
                atLocationStock: c.stock,
                fromLocation: c.location_name,
                name: c.ctg.category.name,
                price: c.price,
                orderStock: qty
              })
            )
          })
        );
      };

      return orders.map((order) => ({
        admin: order.updated_by.username,
        createdAt: moment(order.created_at).format("DD MMM YYYY HH:mm"),
        customer: {
          id: order.customer?.id,
          fullName: order.customer?.full_name,
          phone: order.customer?.phone,
          email: order.customer ? order.customer.email ?? "" : "",
          address: order.customer ? order.customer.address ?? "" : ""
        },
        paymentMethod: order.payment_method,
        id: order.id,
        invoiceId: order.document_id,
        status: order.status,
        products: formattedProducts(order),
        totalAmountsOrder: formatCurrency(order.total_amount)
      }));
    }),
  getCompanyInfo: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.companyInformation.findFirst();
  }),
  updateCompanyInfo: publicProcedure
    .input(updateCompanyProfile)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.companyInformation.update({
        data: input,
        where: {
          id: input.id
        }
      });
    }),
  getInvoiceData: publicProcedure
    .input(String)
    .query(async ({ ctx, input }): Promise<RequestGenerateInvoice> => {
      //  const { companyData, orderData, customerData, invoiceNumber, transaction } =
      // data;
      const [companyData, orders] = await ctx.prisma.$transaction([
        ctx.prisma.companyInformation.findFirst({
          where: {
            id: 1
          }
        }),
        ctx.prisma.order.findUnique({
          where: {
            id: input
          },
          select: {
            customer: {
              select: {
                full_name: true,
                company: true,
                address: true,
                phone: true,
                email: true
              }
            },
            updated_by: {
              select: {
                username: true
              }
            },
            document_id: true,
            discount_percentage: true,
            discount_amount: true,
            tax_amount: true,
            tax_percentage: true,
            total_amount: true,
            product_order: {
              select: {
                category_orders: {
                  select: {
                    categories: {
                      select: {
                        location_name: true,
                        price: true,
                        ctg_stock: true,
                        ctg: {
                          select: {
                            category: {
                              select: {
                                name: true
                              }
                            }
                          }
                        }
                      }
                    },
                    total_stock_category: true
                  }
                },
                product: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        })
      ]);

      const result: OrderRenderedData[] = [];

      if (orders && orders.product_order.length > 0) {
        orders.product_order.forEach((ord) => {
          ord.category_orders.forEach((cat) => {
            result.push({
              name: `${ord.product.name} ${cat.categories.ctg.category.name}`,
              description: "",
              disc: `${orders.discount_percentage} %`,
              price: formatCurrency(cat.categories.price),
              quantity: String(cat.total_stock_category),
              stn: "btg",
              tax: `${orders.tax_percentage} %`,
              totalAmount: formatCurrency(
                cat.total_stock_category * cat.categories.price
              )
            });
          });
        });
      }

      return {
        companyData: {
          name: companyData ? companyData.name.toUpperCase() : "",
          address: companyData ? companyData.address : "",
          phone: companyData ? companyData.tel : "",
          admin:
            orders && orders.updated_by.username
              ? orders.updated_by.username
              : ""
        },
        customerData: {
          name:
            orders && orders.customer
              ? orders.customer.full_name.toUpperCase()
              : "",
          address:
            orders && orders.customer?.address ? orders.customer.address : "",
          company:
            orders && orders.customer?.company ? orders.customer.company : "",
          email: orders && orders.customer?.email ? orders.customer.email : "",
          phone: orders && orders.customer ? orders.customer.phone : ""
        },
        invoiceNumber:
          orders && orders.document_id ? String(orders.document_id) : "",
        transaction: {
          disc: orders ? orders.discount_amount : 0,
          rest: orders ? orders.total_amount : 0,
          subtotal: orders
            ? orders.total_amount + orders.discount_amount - orders.tax_amount
            : 0,
          tax: orders ? orders.tax_percentage : 0,
          total: orders ? orders.total_amount : 0,
          totalTax: orders ? orders.tax_amount : 0
        },
        orderData: result
      };
    }),
  getStatusStockBanner: publicProcedure
    .input(String)
    .query(async ({ ctx, input }) => await product(ctx).getStatus(new Date())),
  getBannerInfo: publicProcedure.query(
    async ({ ctx, input }): Promise<Record<string, number>> => {
      const groupTotalBasedOnStatus = await ctx.prisma.order.groupBy({
        by: ["status"],
        _count: {
          status: true
        },
        _sum: {
          total_amount: true
        }
      });

      const result: Record<string, number> = {
        success: 0,
        process: 0,
        omset: 0
      };

      groupTotalBasedOnStatus.forEach((f) => {
        if (f.status === "success") {
          result["omset"] = f._sum.total_amount || 0;
        }

        result[f.status] = f._count.status;
      });

      return result;
    }
  )
});

export type AppRouter = typeof appRouter;
