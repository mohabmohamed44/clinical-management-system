import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./Lib/Context/AuthContext";
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
import Departments from "./Pages/Departments/Departments";
import Offers from "./Pages/Offers/Offers";
import Book from "./Pages/Book/Book";
import DoctorDetails from "./Pages/DoctorDetails/DoctorDetails";
import Clinics from "./Pages/Clinics/Clinics";
import ClinicDetails from "./Pages/ClinicDetails/ClinicDetails";
import AppointmentDetails from './Pages/AppointmentDetails/AppointmentDetails';
import Hospitals from "./Pages/hospitals/hospitals";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import HospitalsDetails from "./Pages/HospitalsDetails/HospitalsDetails";
import DepartmentDetails from "./Pages/DepartmentDetails/DepartmentDetails";
import PrivateRoute from './routes/PrivateRoute/PrivateRoute';
import PublicRoute from './routes/PublicRoute/PublicRoute';
import Labs from './Pages/Labs/Labs';
import LabDetails from './Pages/LabDetails/LabDetails';
import Ask from "./Pages/Ask/Ask";
import Questions from "./Pages/Questions/Questions";
import QuestionDetails from './Pages/QuestionDetails/QuestionDetails';
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
      { path: "/departments/:id", element: <PrivateRoute><DepartmentDetails /></PrivateRoute> },
      { path: "clinics", element: <PrivateRoute><Clinics /></PrivateRoute> },
      { path: "/clinics/:id", element: <PrivateRoute><ClinicDetails /></PrivateRoute> },
      { path: "/hospitals/:id", element: <PrivateRoute><HospitalsDetails /></PrivateRoute> },
      { path: "appointments/:id", element: <PrivateRoute><AppointmentDetails /></PrivateRoute> },
      { path: "about", element: <PrivateRoute><About /></PrivateRoute> },
      { path: "blog", element: <PrivateRoute><Blog /></PrivateRoute> },
      { path: "pricing", element: <PrivateRoute><PricingPlan /></PrivateRoute> },
      { path: "offers", element: <PrivateRoute><Offers /></PrivateRoute> },
      { path: "book", element: <PrivateRoute><Book /></PrivateRoute> },
      { path: "find_doctor/:id", element: <PrivateRoute><DoctorDetails /></PrivateRoute> },
      { path: "labs", element: <PrivateRoute><Labs /></PrivateRoute> },
      { path: "/labs/:id", element: <PrivateRoute><LabDetails /></PrivateRoute> },
      { path: "hospitals", element: <PrivateRoute><Hospitals /></PrivateRoute> },
      { path: "profile", element: <PrivateRoute><ProfilePage /></PrivateRoute> },
      { path: "ask-question", element: <PrivateRoute><Ask/></PrivateRoute>},
      { path: "questions", element: <PrivateRoute><Questions/></PrivateRoute> },
      { path: "questions/:id", element: <PrivateRoute><QuestionDetails/></PrivateRoute>},
      { path: "*", element: <PrivateRoute><NotFound /></PrivateRoute> },
    ],
  },
]);

function App() {
  // Browser router
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
