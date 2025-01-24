import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login/Login';
import Layout from './Pages/Layout/Layout'
import Register from './Pages/Register/Register';
import Home from './Pages/Home/Home';

// routing
const router = createBrowserRouter([
  {
    path:"",
    element: <Layout />,
    children: [
      {path:"", index: true, element:<Home/>},
      {path:"login", element:<Login/>},
      {path: "register", element:<Register/>},
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
