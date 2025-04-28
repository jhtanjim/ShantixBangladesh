import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from "../../assets/images/logo.png"

const Footer = () => {
  return (
    <footer className="bg-[#001933] text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Logo and Links */}
        <div className="lg:flex gap-8 justify-between">
          <div className='my-auto'>
          <img src={logoImg} alt="Shantix Logo" className="h-40 mb-4" />
          </div>
          <ul className="space-y-3 text-xl">
            <li><Link to="/" className="hover:underline font-bold">Home</Link></li>
            <li><Link to="/about" className="hover:underline font-bold">About Us</Link></li>
            <li><Link to="/stock" className="hover:underline font-bold">Stock List</Link></li>
            <li><Link to="/auction" className="hover:underline font-bold">Auction</Link></li>
            <li><Link to="/container" className="hover:underline font-bold">Container</Link></li>
            <li><Link to="/how-to-buy" className="hover:underline font-bold">How To Buy</Link></li>
            <li><Link to="/contact" className="hover:underline font-bold">Contact Us</Link></li>
          </ul>
        </div>

        {/* Spacer for bigger screens */}
        <div></div>
 
        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">Shantix Corporation</h3>
          <p className='text-xl '>Dhaka, Bangladesh</p>
          <p className='text-xl '>Chattogram, Bangladesh</p>
          <div className="mt-4  text-xl space-y-2">
            <p><span className="font-bold">📞</span> +81-45-936-0776</p>
            <p><span className="font-bold">📞</span> +81-45-932-2376</p>
            <p><span className="font-bold">✉️</span> <a href="mailto:sales@shantix.info" className="hover:underline text-xl ">sales@shantix.info</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
