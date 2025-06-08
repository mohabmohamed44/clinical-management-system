import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./Lib/Context/AuthContext";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "./Lib/Context/LanguageContext";
import "./App.css";
import Login from "@pages/Login/Login";
import Layout from "@pages/Layout/Layout";
import Register from "@pages/Register/Register";
import Home from "@pages/Home/Home";
import ForgotPassword from "@pages/ForgotPassword/ForgotPassword";
import ResetCode from "@pages/ResetCode/ResetCode";
import UpdatePassword from "@pages/UpdatePassword/UpdatePassword";
import NotFound from "@pages/NotFound/NotFound";
import AllDone from "@pages/AllDone/AllDone";
import Contact from "@pages/Contact/Contact";
import Appointments from "@pages/Appointments/Appointments";
import FindDoctor from "@pages/FindDoctor/FindDoctor";
import Blog from "@pages/Blog/Blog";
import About from "@pages/About/About";
import BookLab from "@pages/BookLab/BookLab";
import PricingPlan from "@pages/PricingPlan/PricingPlan";
import Departments from "@pages/Departments/Departments";
import Offers from "@pages/Offers/Offers";
import Book from "@pages/Book/Book";
import DoctorDetails from "@pages/DoctorDetails/DoctorDetails";
import Clinics from "@pages/Clinics/Clinics";
import ClinicDetails from "@pages/ClinicDetails/ClinicDetails";
import AppointmentDetails from '@pages/AppointmentDetails/AppointmentDetails';
import Hospitals from "@pages/hospitals/hospitals";
import ProfilePage from "@pages/ProfilePage/ProfilePage";
import HospitalsDetails from "@pages/HospitalsDetails/HospitalsDetails";
import DepartmentDetails from "@pages/DepartmentDetails/DepartmentDetails";
import PrivateRoute from './routes/PrivateRoute/PrivateRoute';
import PublicRoute from './routes/PublicRoute/PublicRoute';
import Labs from '@pages/Labs/Labs';
import LabDetails from '@pages/LabDetails/LabDetails';
import Ask from "@pages/Ask/Ask";
import Questions from "@pages/Questions/Questions";
import QuestionDetails from '@pages/QuestionDetails/QuestionDetails';
import FindMedicine from "@pages/FindMedicine/FindMedicine";
import OfferDetails from "@pages/OfferDetails/OfferDetails";
// React Query Client
const queryClient = new QueryClient();

// routing
const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "", index: true, element: <PrivateRoute><Home /></PrivateRoute> },
      { path: "login", element: <PublicRoute><Login /></PublicRoute> },
      { path: "register", element: <PublicRoute><Register /></PublicRoute>},
      { path: "forgot_password", element: <PublicRoute><ForgotPassword /></PublicRoute> },
      { path: "reset_code", element: <PublicRoute><ResetCode /></PublicRoute> },
      { path: "update_password", element: <PublicRoute><UpdatePassword /></PublicRoute> },
      { path: "all_done", element: <PublicRoute><AllDone /></PublicRoute> },
      { path: "contact", element: <PrivateRoute><Contact /></PrivateRoute> },
      { path: "appointments", element: <PrivateRoute><Appointments /></PrivateRoute> },
      { path: "find_doctor", element: <PrivateRoute><FindDoctor /></PrivateRoute> },
      { path: "departments", element: <PrivateRoute><Departments /></PrivateRoute> },
      { path: "clinics", element: <PrivateRoute><Clinics /></PrivateRoute> },
      { path: "/clinics/:id", element: <PrivateRoute><ClinicDetails /></PrivateRoute> },
      { path: "/hospitals/:id", element: <PrivateRoute><HospitalsDetails /></PrivateRoute> },
      { path: "appointments/:id", element: <PrivateRoute><AppointmentDetails /></PrivateRoute> },
      { path: "about", element: <PrivateRoute><About /></PrivateRoute> },
      { path: "blog", element: <PrivateRoute><Blog /></PrivateRoute> },
      { path: "pricing", element: <PrivateRoute><PricingPlan /></PrivateRoute> },
      { path: "offers", element: <PrivateRoute><Offers /></PrivateRoute> },
      { path: "/offers/:id", element: <PrivateRoute><OfferDetails /></PrivateRoute> },
      { path: "find_doctor/:id", element: <PrivateRoute><DoctorDetails /></PrivateRoute> },
      { path: "labs", element: <PrivateRoute><Labs /></PrivateRoute> },
      { path: "/labs/:id", element: <PrivateRoute><LabDetails /></PrivateRoute> },
      { path: "hospitals", element: <PrivateRoute><Hospitals /></PrivateRoute> },
      { path: "profile", element: <PrivateRoute><ProfilePage /></PrivateRoute> },
      { path: "ask-question", element: <PrivateRoute><Ask/></PrivateRoute>},
      { path: "questions", element: <PrivateRoute><Questions/></PrivateRoute> },
      { path: "questions/:id", element: <PrivateRoute><QuestionDetails/></PrivateRoute>},
      { path: "/departments/:specialty/doctors", element: <PrivateRoute><DepartmentDetails /></PrivateRoute> },
      { path: "/find_doctor/:specialty/doctors/:id", element: <PrivateRoute><DoctorDetails /></PrivateRoute> },
      { path: "find-medicine", element: <PrivateRoute><FindMedicine /></PrivateRoute> },
      { path: "/find_doctor/:id/book", element: <PrivateRoute><Book type="doctor" /></PrivateRoute>},
      { path: "/book/:type(clinic|hospital|lab)/:id", element: <PrivateRoute><Book /></PrivateRoute>},
      { path: "/lab/:lab_id", element: <PrivateRoute><BookLab/></PrivateRoute>},
      { path: "*", element: <PrivateRoute><NotFound /></PrivateRoute> },
    ],
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <RouterProvider router={router} />
            <Toaster position="top-center" reverseOrder={false} />
            {/* <ReactQueryDevtools /> */}
          </LanguageProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default App;
