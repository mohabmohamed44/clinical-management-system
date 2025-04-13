import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "./Lib/Context/LanguageContext";
import "./App.css";
import Login from "./Pages/Login/Login";
import Layout from "./Pages/Layout/Layout";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home/Home";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import ResetCode from "./Pages/ResetCode/ResetCode";
import UpdatePassword from "./Pages/UpdatePassword/UpdatePassword";
import NotFound from "./Pages/NotFound/NotFound";
import AllDone from "./Pages/AllDone/AllDone";
import Contact from "./Pages/Contact/Contact";
import Appointments from "./Pages/Appointments/Appointments";
import FindDoctor from "./Pages/FindDoctor/FindDoctor";
import Blog from "./Pages/Blog/Blog";
import About from "./Pages/About/About";
import PricingPlan from "./Pages/PricingPlan/PricingPlan";
import Departments from './Pages/Departments/Departments';
import Offers from './Pages/Offers/Offers';
import Book from "./Pages/Book/Book";
import DoctorDetails from "./Pages/DoctorDetails/DoctorDetails";
import Clinics from "./Pages/Clinics/Clinics";
import Hospitals from './Pages/hospitals/hospitals';
import ProfilePage from "./Pages/ProfilePage/ProfilePage";

// React Query Client
const queryClient = new QueryClient();

// routing
const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "", index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot_password", element: <ForgotPassword /> },
      { path: "reset_code", element: <ResetCode /> },
      { path: "update_password", element: <UpdatePassword /> },
      { path: "all_done", element: <AllDone /> },
      { path: "contact", element: <Contact /> },
      { path: "appointments", element: <Appointments /> },
      { path: "find_doctor", element: <FindDoctor /> },
      { path: "departments", element: <Departments/>},
      { path: "about", element: <About /> },
      { path: "blog", element: <Blog /> },
      { path: "pricing", element: <PricingPlan />},
      { path: "offers", element: <Offers/>},
      { path: "book", element: <Book/>},
      { path: "doctorDetails", element: <DoctorDetails/>},
      { path: 'clinics/:id', element: <Clinics/>},
      { path: 'hospitals', element: <Hospitals/>},
      { path: "profile", element: <ProfilePage/>},
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  // Browser router
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" reverseOrder={false} />
          <ReactQueryDevtools />
        </LanguageProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;