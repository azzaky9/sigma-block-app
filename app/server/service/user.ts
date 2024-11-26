import { VTAdminSchema, VTEditSchema } from "../validation/base";
import { Context } from "@/routes/api/context";
import bcrypt from "bcrypt";

type BasedParams<T> = {
  data: T;
};

export const user = {
  create: async ({ data }: BasedParams<VTAdminSchema>, ctx: Context) => {
    const { password } = data;

    const encrypt = await bcrypt.hash(password, 12);

    await ctx.prisma.user.create({
      data: { ...data, password: encrypt }
    });
  },
  getAll: async (ctx: Context) => await ctx.prisma.user.findMany(),
  getById: async ({ data }: BasedParams<{ id: number }>, ctx: Context) => {
    const { id } = data;

    return await ctx.prisma.user.findFirst({
      where: {
        id
      },
      select: {
        email: true,
        role: true,
        username: true,
        last_seen: true,
        created_at: true,
        updated_at: true
      }
    });
  },
  updateExistingProp: async (
    { data }: BasedParams<VTEditSchema>,
    ctx: Context
  ) => {
    let encryptedPass = "";

    if (data.password) {
      const result = await bcrypt.hash(data.password, 12);
      encryptedPass = result;
    }

    await ctx.prisma.user.update({
      where: { id: data.id },
      data: {
        username: data.username,
        role: data.role,
        password: encryptedPass ? encryptedPass : undefined
      }
    });
  },
  deleteBySelectionId: async ({ data }: BasedParams<number[]>, ctx: Context) =>
    await ctx.prisma.user.deleteMany({
      where: {
        id: {
          in: data
        }
      }
    })
};
