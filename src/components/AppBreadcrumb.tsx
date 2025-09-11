import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";
import { mockProducts, mockSellers } from "@/data/mockData";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');

export const AppBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  const getBreadcrumbName = (segment: string, index: number, pathArr: string[]) => {
    if (pathArr[0] === "product") {
      if (index === 0) return "Products";
      if (index === 1) {
        const product = mockProducts.find((p) => p.id === segment);
        return product ? product.name : segment;
      }
    }
    if (pathArr[0] === "seller") {
      if (index === 0) return "Sellers";
      if (index === 1) {
        const seller = mockSellers.find((s) => s.id === segment);
        return seller ? seller.name : segment;
      }
    }
    if (segment === 'order-confirmation') return "Order Confirmation";
    
    return capitalize(segment);
  };

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          const isAbstractGrouping =
            index === 0 && (value === "product" || value === "seller");

          return (
            <BreadcrumbItem key={to}>
              <BreadcrumbSeparator />
              {isLast || isAbstractGrouping ? (
                <BreadcrumbPage>
                  {getBreadcrumbName(value, index, pathnames)}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={to}>{getBreadcrumbName(value, index, pathnames)}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};