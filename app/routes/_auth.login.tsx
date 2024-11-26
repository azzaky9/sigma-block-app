import AuthForms from "@/components/Forms/AuthForm";
import { generateDynamicMeta } from "@/utils/dynamic-meta";
import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = generateDynamicMeta;

export default function Login() {
  return (
    <main className="h-screen bg-slate-100 w-full grid place-content-center">
      <AuthForms token={"csrf-some-token"} />
    </main>
  );
}
