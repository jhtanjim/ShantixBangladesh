import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/navbar/Navbar";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import WhatsAppChat from "../components/whatsAppChat/whatsAppChat";

const Main = () => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppChat /> {/* Add WhatsApp chat component */}
    </div>
  );
};

export default Main;
