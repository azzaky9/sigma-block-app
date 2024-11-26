import { MetaFunction } from "@remix-run/node";

export const generateDynamicMeta: MetaFunction = ({ location }) => {
  const formatTitle = (path: string) => {
    const segments = path.replace(/^\//, "").split("/");
    if (path === "/") return "Home";

    const title = segments
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" - ");

    return `${title} | App`;
  };

  return [
    {
      title: formatTitle(location.pathname)
    }
  ];
};
