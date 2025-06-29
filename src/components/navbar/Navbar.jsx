import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Menu, X, Phone, Clock, User } from "lucide-react";
import { useShop } from "../../Context/ShopContext";
import logoImg from "../../assets/images/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import useUsersRole from "../../hooks/useUsersRole";

const Navbar = () => {
  const { cartCount, wishlistCount } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, logout, user } = useAuth();
  const { isAdmin } = useUsersRole(); // Use the hook to check admin role
  const navigate = useNavigate();
  
  // Force re-render when auth state changes
  const [authState, setAuthState] = useState({
    isAuthenticated: Boolean(token),
    currentUser: user
  });

  useEffect(() => {
    setAuthState({
      isAuthenticated: Boolean(token),
      currentUser: user
    });
  }, [token, user]);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    navigate("/");
    // Force update auth state immediately
    setAuthState({
      isAuthenticated: false,
      currentUser: null
    });
  };

  // Filter nav links based on user role
  const baseNavLinks = [
    { href: "/about", label: "About Us" },
    { href: "/howToBuy", label: "How To Buy" },
    { href: "/enquiry", label: "Inquiry" },
    { href: "/contact", label: "Contact Us" },
    { href: "/shipSchedule", label: "Ship Schedule" },
    { href: "/allCars", label: "All Cars" },
  ];

  // Add admin link only if user is admin
  const navLinks = isAdmin() 
    ? [...baseNavLinks, { href: "/admin", label: "Admin" }]
    : baseNavLinks;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2 gap-2">
            <div className="text-center lg:text-left">
              <span className="text-lg font-semibold">1 USD = 142.08 JPY</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Clock size={16} />
              <span className="text-sm">Japan Time: 05:39 AM, Thursday</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href="tel:+88-34-777-0000" className="flex items-center gap-1 hover:text-gray-200 transition-colors">
                <Phone size={14} />
                +88-34-777-0000
              </a>

              {authState.isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <NavLink to="/profile" className="flex items-center gap-1 hover:text-gray-200 transition-colors">
                    <User size={14} />
                    Welcome, {authState.currentUser?.firstName || "User"}
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <NavLink to="/login" className="hover:text-gray-200 transition-colors">Login</NavLink>
                  <NavLink to="/register" className="hover:text-gray-200 transition-colors">Register</NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <NavLink to="/">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute top-0 w-1 h-12 rounded-r"></div>
                <img src={logoImg} alt="Shantix Logo" className="h-12 w-auto ml-2" />
              </div>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            ))}
          </nav>

          {/* Icons & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-red-600 transition-colors">
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Only show My Page button when user is authenticated */}
            {authState.isAuthenticated && (
              <Link to="/profile" className="hidden lg:block">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  My Page
                </button>
              </Link>
            )}

            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Only show My Page button in mobile menu when user is authenticated */}
              {authState.isAuthenticated && (
                <div className="pt-4 border-t border-gray-200">
                  <Link to="/profile">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                      My Page
                    </button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;