import MainSidebar from "@/components/Layouts/MainSidebar";
import { generateDynamicMeta } from "@/utils/dynamic-meta";
import { MetaFunction, Outlet } from "@remix-run/react";

export const meta: MetaFunction = generateDynamicMeta;

export default function Dashboard() {
  return (
    <MainSidebar>
      <Outlet />
    </MainSidebar>
  );
}
