import Footer from "./Footer";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

function Layout() {
  console.log("layout rendered");
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
