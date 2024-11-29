import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { authSchema } from "@/server/validation/auth.validation";
import { findUserByEmail } from "@/server/service/user.service";

const authenticator = new Authenticator<User>();

const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) throw new Error("User not found");

  const validate = bcrypt.compareSync(password, user.password);

  if (!validate) throw new Error("Invalid password");

  return user;
};

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");

    const validateRequest = authSchema.safeParse({ email, password });
    if (!validateRequest.success)
      throw new Error("Username or Password invalid");

    const result = await login(
      validateRequest.data.email,
      validateRequest.data.password
    );
    return result;
  }),
  "user-pass"
);

export { authenticator };
