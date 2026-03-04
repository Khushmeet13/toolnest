import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const capitalize = (str) => {
  return str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...pathnames.map((segment, index) => {
      const href = "/" + pathnames.slice(0, index + 1).join("/");
      return {
        label: capitalize(segment),
        href: index === pathnames.length - 1 ? null : href,
      };
    }),
  ];

  return (
    <nav className="text-xs lg:text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            )}
            {item.href ? (
              <Link to={item.href} className="hover:underline text-cyan-600">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
