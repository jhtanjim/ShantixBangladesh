import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/navbar/Navbar";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

const Main = () => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Main;
