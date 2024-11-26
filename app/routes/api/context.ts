import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import prisma from "@/database/db";

export const createContext = async ({
  resHeaders,
  req
}: FetchCreateContextFnOptions) => {
  const session = {
    user: {
      username: "admin",
      id: 1,
      role: "admin",
      email: "admin@mail.com"
    }
  };

  return {
    req,
    resHeaders,
    session,
    prisma
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
