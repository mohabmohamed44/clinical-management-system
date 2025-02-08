import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen relative"> {/* Add relative */}
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 py-10 max-w-screen-xl overflow-x-hidden">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}