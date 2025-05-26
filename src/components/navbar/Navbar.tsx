import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/images/logo.png';
import { NavLink } from '../ui/NavLink';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isAuthenticated = !!token;

  return (
    <header className="border bg-white">
      <div className="flex flex-col lg:flex-row lg:h-32">
        {/* Logo */}
        <div className="flex justify-center lg:justify-end lg:border-r-4 border-[#003366] lg:w-60 p-2">
          <img src={logoImg} alt="Logo" className="max-w-[157px] max-h-[95px] object-contain" />
        </div>

        {/* Info and Auth */}
        <div className="w-full">
          <div className="bg-[#C9252B] text-white py-2 flex flex-col lg:flex-row lg:items-center lg:justify-between px-4">
            <span className="text-lg lg:text-2xl font-semibold text-center">1US$ = 148.13 JPY</span>
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6.62 10.79a9 9 0 0110.76 0" />
              </svg>
              <span className="text-sm lg:text-xl">Japan Time: 05:39 am, Thursday</span>
            </div>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              <a href="tel:+88-34-777-0000" className="flex items-center text-sm lg:text-xl">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a2 2 0 011.95 1.57l.3 1.2a2 2 0 01-.45 1.88l-1.5 1.5a16 16 0 006.06 6.06l1.5-1.5a2 2 0 011.88-.45l1.2.3A2 2 0 0119 15.72V19a2 2 0 01-2 2h-1C9.268 21 3 14.732 3 7V6a2 2 0 012-1z" />
                </svg>
                +88-34-777-0000
              </a>

              {isAuthenticated ? (
                <>
                 <Link to={"/profile"}> <span className="text-sm lg:text-xl">Welcome, {user?.name || 'User'}</span></Link>
                  <button onClick={handleLogout} className="text-sm lg:text-xl underline">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm lg:text-xl underline">Login</Link>
                  <Link to="/register" className="text-sm lg:text-xl underline">Register</Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex justify-end p-4">
            <button onClick={toggleMenu}>
              <svg className="w-8 h-8 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex justify-center items-center py-4 bg-white border-t">
            <ul className="flex gap-6 text-[#003366] text-lg font-medium">
              <NavLink href="/about">About Us</NavLink>
              <NavLink href="/stock-list">Stock List</NavLink>
              <NavLink href="/allCars">How To Buy</NavLink>
              <NavLink href="/auction">Auction</NavLink>
              <NavLink href="/container">Container</NavLink>
              <NavLink href="/enquiry">Inquiry</NavLink>
              <NavLink href="/contactUs">Contact Us</NavLink>
              <NavLink href="/ship-schedule">Ship Schedule</NavLink>
              <NavLink href="/allCars">All Car</NavLink>
              <Button>My Page</Button>
            </ul>
          </nav>

          {/* Mobile nav links */}
          {mobileMenuOpen && (
            <nav className="lg:hidden bg-white px-6 py-4 space-y-4 border-t">
              <NavLink href="/about">About Us</NavLink>
              <NavLink href="/stock-list">Stock List</NavLink>
              <NavLink href="/allCars">How To Buy</NavLink>
              <NavLink href="/auction">Auction</NavLink>
              <NavLink href="/container">Container</NavLink>
              <NavLink href="/enquiry">Inquiry</NavLink>
              <NavLink href="/contactUs">Contact Us</NavLink>
              <NavLink href="/ship-schedule">Ship Schedule</NavLink>
              <NavLink href="/allCars">All Car</NavLink>
              <Button className="w-full">My Page</Button>

              <div className="border-t pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <span className="text-gray-700">Welcome, {user?.name || 'User'}</span>
                    <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                    <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
