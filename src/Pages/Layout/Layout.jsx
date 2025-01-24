import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import {Outlet} from 'react-router-dom';
export default function Layout() { 
  return (
    <> 
      <Navbar />
      <div className="container py-10 px-3 md:px-2 mx-auto max-w-screen-xl">
        <Outlet />
      </div>
      <Footer/>
    </>
  );
}
