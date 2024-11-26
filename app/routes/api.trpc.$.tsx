import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/routes/api/trpc";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { createContext } from "@/routes/api/context";

export const loader = async (args: LoaderFunctionArgs) => {
  return handleRequest(args);
};
export const action = async (args: ActionFunctionArgs) => {
  return handleRequest(args);
};
function handleRequest(args: LoaderFunctionArgs | ActionFunctionArgs) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: args.request,
    router: appRouter,
    createContext: createContext
  });
}
