import * as z from "zod";
import { user as db } from "../db/user";
import { publicProcedure, router } from "../trpc";
import {
  EditAdmin as EditAdminSchema,
  Admin as SchemaAdmin
} from "../validation/base";

export const userRouter = router({
  createAdmin: publicProcedure
    .input(SchemaAdmin)
    .mutation(async ({ input, ctx }) => await db.create({ data: input }, ctx)),
  getAllAdmin: publicProcedure.query(async ({ ctx }) => await db.getAll(ctx)),
  deleteSelection: publicProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      await db.deleteBySelectionId({ data: input }, ctx);
    }),
  updateUser: publicProcedure
    .input(EditAdminSchema)
    .mutation(async ({ ctx, input }) => {
      await db.updateExistingProp({ data: input }, ctx);
    })
});
