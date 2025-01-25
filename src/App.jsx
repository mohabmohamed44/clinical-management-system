import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login/Login';
import Layout from './Pages/Layout/Layout'
import Register from './Pages/Register/Register';
import Home from './Pages/Home/Home';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetCode from './Pages/ResetCode/ResetCode';

// routing
const router = createBrowserRouter([
  {
    path:"",
    element: <Layout />,
    children: [
      {path: "", index: true, element:<Home/>},
      {path: "login", element:<Login/>},
      {path: "register", element:<Register/>},
      {path: "forgot_password", element: <ForgotPassword/>},
      {path: "reset_code", element: <ResetCode/>}
    ],
  }
])
function App() {
  // Browser router
  return (
    <>
      <RouterProvider router={router} />
    </> 
  )
}

export default App
