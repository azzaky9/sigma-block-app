import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import prisma from "@/database/db";
import { getSession } from "@/utils/session";

export const createContext = async ({
  resHeaders,
  req
}: FetchCreateContextFnOptions) => {
  const serverSession = await getSession(req.headers.get("cookie"));

  const session = {
    user: {
      id: serverSession.get("userId"),
      username: serverSession.get("username"),
      role: serverSession.get("role")
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
