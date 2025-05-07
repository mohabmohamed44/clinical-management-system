import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import ChatBot from '../../Components/ChatBot/ChatBot';
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Layout() {
  // get the current route
  const location = useLocation();

  // Define routes where the footer, navbar, and chatbot should be hidden
  const hideRoutes = ["/login", "/register", "/forgot_password", "/reset_code", "/update_password", "/all_done", "/chatbot"];
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-gray-50"> 
      {!hideRoutes.includes(location.pathname) && <Navbar/>}
      <main className="flex-1">
        <div className="mx-auto px-4 sm:px-6 py-10 max-w-screen-2xl">
          <Outlet />
        </div>
      </main>
      {!hideRoutes.includes(location.pathname) && <ChatBot/>}
      {!hideRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}