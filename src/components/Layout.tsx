import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Footer } from "./Footer";

const Layout = () => {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Sidebar is removed, Header handles mobile navigation */}
      <div className="flex flex-col flex-1"> {/* Removed sm:pl-64 */}
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;