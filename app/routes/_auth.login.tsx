import AuthForms from "@/components/Forms/AuthForm";
import { authenticator } from "@/server/service/auth.service";
import { authSchema } from "@/server/validation/auth.validation";
import { generateDynamicMeta } from "@/utils/dynamic-meta";
import { commitSession, getSession } from "@/utils/session";
import { ActionFunctionArgs } from "@remix-run/node";
import { MetaFunction, redirect, useActionData } from "@remix-run/react";

export const meta: MetaFunction = generateDynamicMeta;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.clone().formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { success, error } = authSchema.safeParse({ email, password });

  if (!success) {
    const errors = error.flatten();
    return Response.json(
      {
        email: errors.fieldErrors.email,
        password: errors.fieldErrors.password
      },
      { status: 400 }
    );
  }

  try {
    const user = await authenticator.authenticate("user-pass", request);
    const session = await getSession(request.headers.get("cookie"));
    session.set("username", user.username);
    session.set("role", user.role);
    session.set("userId", user.id);

    return redirect("/dashboard", {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  } catch (error) {
    if (error instanceof Error) console.log("error:", error);
    return null;
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="h-screen bg-slate-100 w-full grid place-content-center">
      <AuthForms
        token={"csrf-some-token"}
        error={actionData ?? { email: [], password: [] }}
      />
    </main>
  );
}
