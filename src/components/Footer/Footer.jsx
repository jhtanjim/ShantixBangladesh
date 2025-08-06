import { Link } from "react-router-dom";
import logoImg from "../../assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#001933] text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Logo and Links */}
        <div className="lg:flex gap-8 justify-between">
          <div className="my-auto">
            <img src={logoImg} alt="Shantix Logo" className="h-12 mb-4" />
          </div>
          <ul className="space-y-3 text-xl">
            <li>
              <Link to="/" className="hover:underline font-bold">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline font-bold">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/howToBuy" className="hover:underline font-bold">
                How To Buy
              </Link>
            </li>
            <li>
              <Link to="/enquiry" className="hover:underline font-bold">
                Inquiry
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline font-bold">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/shipSchedule" className="hover:underline font-bold">
                Ship Schedule
              </Link>
            </li>
            <li>
              <Link to="/allCars" className="hover:underline font-bold">
                All Cars
              </Link>
            </li>
          </ul>
        </div>

        {/* Spacer for bigger screens */}
        <div></div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">Shantix Corporation</h3>
          <p className="text-xl">
            Shin-Okubo Building 2, 3rd floor, 1-11-1, Hyakunincho, Shinjuku-ku,
            Tokyo 169-0073, Japan
          </p>

          <div className="mt-4 text-xl space-y-2">
            <p>
              <span className="font-bold">📞</span>
              +81-45-932-2376
            </p>
            <p>
              <span className="font-bold">📞</span>+81 90-8347-9620
            </p>
            <p>
              <span className="font-bold">✉️</span>{" "}
              <a
                href="mailto:info@shantix.jp"
                className="hover:underline text-xl"
              >
                info@shantix.jp
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
