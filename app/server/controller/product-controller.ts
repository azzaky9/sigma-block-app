import moment, { Moment } from "moment";
import { Context } from "../context";
import { TUpdateProduct } from "../validation/product.validation";
import { formatCurrency } from "../service/formatCurrency";
import { VTCreateProduct } from "../validation/base";
import { ReturnShortenCreatedCategory } from "./category-controller";

export type StatusBannerStock = {
  locationTotal: number;
  spending: string;
  productInsertedToday: number;
};

export type ReturnCreatedProduct = {
  id: number;
  category: ReturnShortenCreatedCategory[];
};

type ProductControllerOptions = {
  getStatus: (queryDate: Date | Moment) => Promise<StatusBannerStock>;
  update: (updatedData: TUpdateProduct) => Promise<void>;
  create: (
    productData: VTCreateProduct,
    insertWithCategory: boolean
  ) => Promise<ReturnCreatedProduct>;
};

export const product = (ctx: Context): ProductControllerOptions => {
  return {
    create: async (productData, insertWithCategory) => {
      const input = productData;

      const createdProduct = await ctx.prisma.product.create({
        data: {
          production_cost: 0,
          name: input.name,
          amount: Number(input.amount),
          supplier: input.supplier,
          amount_supplier: Number(input.amountSupplier),
          stock: input.stock ? input.stock : 0,
          created_by: Number(ctx.session.user.id),
          category: {
            createMany: {
              data: insertWithCategory
                ? input.category.map((ctg) => ({
                    name: ctg.name
                  }))
                : []
            }
          }
        },
        select: {
          id: true,
          category: insertWithCategory
        }
      });
      await ctx.prisma.productLocation.create({
        data: {
          location_name: input.location,
          product_code: createdProduct.id
        }
      });

      return createdProduct;
    },
    getStatus: async (queryDate) => {
      const totalLocations = await ctx.prisma.location.count();

      const totalSpending = await ctx.prisma.product.aggregate({
        _sum: {
          amount_supplier: true
        }
      });
      const startDate = moment().startOf("day").toDate();
      const endDate = moment().endOf("day").toDate();
      const productInsertedToday = await ctx.prisma.product.count({
        where: {
          created_at: {
            gt: startDate,
            lt: endDate
          }
        }
      });

      return {
        locationTotal: totalLocations,
        spending: !!totalSpending._sum.amount_supplier
          ? formatCurrency(totalSpending._sum.amount_supplier)
          : formatCurrency(0),
        productInsertedToday: productInsertedToday
      };
    },
    update: async (updatedData) => {
      const u = updatedData;
      // delete if exist
      if (u.deletedRecord.length > 0) {
        await Promise.all(
          u.deletedRecord.map(async ({ stockId, stockLocationId }) => {
            await ctx.prisma.$transaction([
              ctx.prisma.categoryStock.delete({
                where: {
                  id: stockId
                }
              }),
              ctx.prisma.categoryStockAtLocation.delete({
                where: {
                  id: Number(stockLocationId)
                }
              })
            ]);
          })
        );
      }
      if (u.newRecord.length > 0) {
        const createdCategory = await Promise.all(
          u.newRecord.map(async (r) => {
            return await ctx.prisma.category.create({
              data: {
                product_id: updatedData.id,
                name: r.name
              },
              select: {
                id: true
              }
            });
          })
        );
        const cat = await Promise.all(
          createdCategory.map(async ({ id }) =>
            ctx.prisma.categoryStock.create({ data: { category_id: id } })
          )
        );
        await ctx.prisma.categoryStockAtLocation.createMany({
          data: cat.map((c) => ({
            ctg_stock: c.id,
            location_name: updatedData.locationName,
            stock: updatedData.newRecord[0].stock,
            price: updatedData.newRecord[0].price
          }))
        });
      }

      await ctx.prisma.product.update({
        data: {
          supplier: u.supplier,
          amount: +u.amount,
          amount_supplier: +u.amountSupplier,
          name: u.name,
          stock: u.stock,
          category: {
            update: updatedData.category.map((u) => ({
              data: {
                stock: {
                  update: {
                    data: {
                      ctg_stock_location: {
                        update: {
                          data: {
                            stock: u.stock,
                            price: u.price
                          },
                          where: {
                            id: u.stockLocationId,
                            location_name: updatedData.locationName
                          }
                        }
                      }
                    },
                    where: {
                      id: u.stockId
                    }
                  }
                }
              },
              where: { id: u.id }
            }))
          }
        },
        where: {
          id: updatedData.id
        }
      });
    }
  };
};
