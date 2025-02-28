import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Layout() {
  // get the current route
  const location = useLocation();

  // Define routes where the footer should be hidden
  const hideFooterRoutes = ["/login","/register","/forgot_password","/reset_code","/update_password", "/all_done"];
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-gray-50"> 
      {!hideFooterRoutes.includes(location.pathname) && <Navbar/>}
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 py-10 max-w-screen-xl">
          <Outlet />
        </div>
      </main>
      {/* only render footer if current path is not in hideFooterRoutes*/}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}