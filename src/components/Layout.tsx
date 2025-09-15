import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Footer } from "./Footer";

const Layout = () => {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col sm:pl-64 flex-1">
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