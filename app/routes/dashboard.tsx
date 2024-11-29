import MainSidebar from "@/components/Layouts/MainSidebar";
import { generateDynamicMeta } from "@/utils/dynamic-meta";
import { requireUserSession } from "@/utils/session";
import { LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, Outlet } from "@remix-run/react";

export const meta: MetaFunction = generateDynamicMeta;

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);

  return null;
}

export default function Dashboard() {
  return (
    <MainSidebar>
      <Outlet />
    </MainSidebar>
  );
}
