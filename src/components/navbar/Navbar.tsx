// Navbar.jsx
import  { useState } from 'react';
import logoImg from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { NavLink } from '../ui/NavLink';
import Button from '../ui/Button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className='border'>
      <div className='flex flex-col lg:flex-row lg:h-32'>
        {/* logo section */}
        <div className='flex justify-center lg:justify-end bg-white lg:border-r-3 lg:w-90 border-[#003366] py-2 lg:py-0'>
          <div>
            <img
              className='p-2 lg:p-4 lg:my-4'
              style={{ maxWidth: "157.23px", maxHeight: "95px", width: "100%", height: "auto" }}
              src={logoImg}
              alt="Shantix Logo"
            />
          </div>
        </div>

        {/* main content section */}
        <div className='w-full'>
          {/* top red bar */}
          <div className='bg-[#C9252B] py-2 lg:h-[50%] flex flex-col lg:flex-row items-center lg:justify-center px-4 lg:ps-12 lg:pr-4 text-white'>
            <div className='flex flex-col lg:flex-row justify-between w-full lg:space-x-20 space-y-2 lg:space-y-0'>
              <span className='text-lg lg:text-2xl font-medium text-center lg:text-left'>1US$ = 148.13 JPY</span>
              
              <div className='flex items-center justify-center lg:justify-start'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 lg:h-4 lg:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className='text-sm lg:text-2xl'>Japan Time: 05:39 am, Thursday</span>
              </div>
              
              <div className='flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-8'>
                <a href="tel:+88-34-777-0000" className='flex items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 lg:h-4 lg:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className='text-sm lg:text-2xl'>+88-34-777-0000</span>
                </a>
                
                <div className='flex space-x-4'>
                  <Link to="/login" className='text-sm lg:text-2xl hover:underline'>Login</Link>
                  <Link to="/register" className='text-sm lg:text-2xl hover:underline'>Register</Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className='lg:hidden flex justify-end p-4'>
            <button onClick={toggleMenu} className='text-[#003366]'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* bottom navigation - desktop */}
          <div className='hidden lg:flex h-[50%] items-center justify-center px-4'>
            <div className='flex items-center text-lg xl:text-2xl font-semibold space-x-4 xl:space-x-12 text-dark-blue'>
              <NavLink href="/about">About Us</NavLink>
              <NavLink href="/stock-list">Stock List</NavLink>
              <NavLink href="/allCars">How To Buy</NavLink>
              <NavLink href="/auction">Auction</NavLink>
              <NavLink href="/container">Container</NavLink>
              <NavLink href="/inquiry">Inquiry</NavLink>
              <NavLink href="/contactUs">Contact Us</NavLink>
              <NavLink href="/ship-schedule">Ship Schedule</NavLink>
              <Button>My Page</Button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white py-4`}>
            <div className='flex flex-col space-y-4 px-6'>
              <NavLink href="/about">About Us</NavLink>
              <NavLink href="/stock-list">Stock List</NavLink>
              <NavLink href="/allCars">How To Buy</NavLink>
              <NavLink href="/auction">Auction</NavLink>
              <NavLink href="/container">Container</NavLink>
              <NavLink href="/inquiry">Inquiry</NavLink>
              <NavLink href="/contactUs">Contact Us</NavLink>
              <NavLink href="/ship-schedule">Ship Schedule</NavLink>
              <div className="mt-2">
                <Button>My Page</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
