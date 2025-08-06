import {
  Clock,
  Heart,
  LogOut,
  Menu,
  Phone,
  Search,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useShop } from "../../Context/ShopContext";
import logoImg from "../../assets/images/logo.png";

import useUsersRole from "../../hooks/useUsersRole";

const Navbar = () => {
  const { cartCount, wishlistCount } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, token, logout } = useAuth();
  const { isAdmin } = useUsersRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [japanTime, setJapanTime] = useState("");
  const { exchangeRate, formatYenPrice } = useShop();

  // japan time
  useEffect(() => {
    const updateJapanTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Tokyo",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setJapanTime(formatter.format(now));
    };

    updateJapanTime(); // initial call
    const interval = setInterval(updateJapanTime, 60 * 1000); // update every minute

    return () => clearInterval(interval); // cleanup
  }, []);

  // Force re-render when auth state changes
  const [authState, setAuthState] = useState({
    isAuthenticated: Boolean(token),
    currentUser: user,
  });

  useEffect(() => {
    setAuthState({
      isAuthenticated: Boolean(token),
      currentUser: user,
    });
  }, [token, user]);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    navigate("/");
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home page with search query
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setMobileMenuOpen(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearch(false);
    // Navigate to home without search parameter
    navigate("/");
  };

  // Filter nav links based on user role
  const baseNavLinks = [
    { href: "/about", label: "About Us" },
    { href: "/howToBuy", label: "How To Buy" },
    { href: "/enquiry", label: "Inquiry" },
    { href: "/contact", label: "Contact Us" },
    { href: "/shipSchedule", label: "Ship Schedule & FAQ" },
    { href: "/auction", label: "Auction" },
    { href: "/allCars", label: "All Cars & Stock" },
  ];

  const navLinks = isAdmin()
    ? [...baseNavLinks, { href: "/admin", label: "Admin" }]
    : baseNavLinks;

  // Active link styling function
  const getNavLinkClass = ({ isActive }) => {
    return `text-gray-700 hover:text-blue-600 font-medium transition-colors relative group text-sm xl:text-base ${
      isActive ? "text-blue-600" : ""
    }`;
  };

  const getMobileNavLinkClass = ({ isActive }) => {
    return `block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors ${
      isActive ? "text-blue-600 bg-blue-50 px-3 rounded-md" : ""
    }`;
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1 sm:py-2 gap-1 sm:gap-2">
            <div className="text-center sm:text-left order-2 sm:order-1">
              <span className="text-sm sm:text-base lg:text-lg font-medium sm:font-semibold">
                1 USD = {exchangeRate} JPY
              </span>
            </div>

            <div className="flex items-center justify-center gap-1 sm:gap-2 order-1 sm:order-2">
              <Clock size={14} className="sm:size-4" />
              <span className="text-xs sm:text-sm">
                Japan Time: {japanTime}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm order-3">
              <a
                href="tel:+81-70839-31325"
                className="hidden sm:flex items-center gap-1 hover:text-gray-200 transition-colors"
              >
                <Phone size={12} className="sm:size-3.5" />
                <span className="hidden md:inline">+81-70839-31325</span>
                <span className="md:hidden">Call</span>
              </a>

              {authState.isAuthenticated ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-1 hover:text-gray-200 transition-colors ${
                        isActive ? "text-gray-200" : ""
                      }`
                    }
                  >
                    <User size={12} className="sm:size-3.5" />
                    <span className="truncate max-w-20 sm:max-w-none">
                      {authState.currentUser?.data?.fullName ||
                        authState.currentUser?.fullName ||
                        "User"}
                    </span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2 py-1 rounded hover:text-blue-800 transition-colors"
                  >
                    <LogOut size={16} className="sm:size-4" />
                    <span className="hidden sm:inline text-sm">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `flex items-center gap-1 hover:text-gray-200 transition-colors px-2 py-1 rounded ${
                        isActive ? "text-gray-200 bg-red-700" : ""
                      }`
                    }
                  >
                    <User size={14} />
                    <span>Login</span>
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `flex items-center gap-1 hover:text-gray-200 transition-colors px-2 py-1 rounded ${
                        isActive ? "text-gray-200 bg-red-700" : ""
                      }`
                    }
                  >
                    <User size={14} />
                    <span>Register</span>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Logo */}
          <NavLink to="/">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute top-0 w-1 h-8 sm:h-10 lg:h-12 rounded-r"></div>
                <img
                  src={logoImg}
                  alt="Shantix Logo"
                  className="h-8 sm:h-10 lg:h-8 w-auto ml-2"
                />
              </div>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={getNavLinkClass}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </form>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Icons & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-1.5 sm:p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Search size={20} className="sm:size-6" />
            </button>

            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `relative p-1.5 sm:p-2 text-gray-700 hover:text-red-600 transition-colors ${
                  isActive ? "text-red-600" : ""
                }`
              }
            >
              <Heart size={20} className="sm:size-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </NavLink>

            {/* <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative p-1.5 sm:p-2 text-gray-700 hover:text-blue-600 transition-colors ${
                  isActive ? "text-blue-600" : ""
                }`
              }
            >
              <ShoppingCart size={20} className="sm:size-6" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </NavLink> */}

            {authState.isAuthenticated && (
              <NavLink to="/profile" className="hidden lg:block">
                {({ isActive }) => (
                  <button
                    className={`text-white px-4 xl:px-6 py-2 rounded-lg font-medium transition-colors text-sm xl:text-base ${
                      isActive ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    My Page
                  </button>
                )}
              </NavLink>
            )}

            <button
              onClick={toggleMenu}
              className="lg:hidden p-1.5 sm:p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? (
                <X size={20} className="sm:size-6" />
              ) : (
                <Menu size={20} className="sm:size-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  autoFocus
                />
              </form>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={getMobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              <a
                href="tel:+81-70839-31325"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone size={16} />
                +81-70839-31325
              </a>

              {authState.isAuthenticated && (
                <div className="pt-3 border-t border-gray-200">
                  <NavLink to="/profile">
                    {({ isActive }) => (
                      <button
                        className={`w-full text-white px-6 py-3 rounded-lg font-medium transition-colors ${
                          isActive
                            ? "bg-blue-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Page
                      </button>
                    )}
                  </NavLink>
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
