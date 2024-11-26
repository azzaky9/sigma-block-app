import { TRPCError } from "@trpc/server"

const internalServerError = (e: Error) => {
  console.log(e.message)
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Error happen at server, check logs for details."
  })
}

export { internalServerError } 