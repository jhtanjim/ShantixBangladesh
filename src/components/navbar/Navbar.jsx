import { Clock, Heart, Menu, Phone, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useShop } from "../../Context/ShopContext";
import logoImg from "../../assets/images/logo.png";
import { useCurrentUser } from "../../hooks/useUsers";
import useUsersRole from "../../hooks/useUsersRole";

const Navbar = () => {
  const { cartCount, wishlistCount } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();

  const { token, logout } = useAuth();
  const { isAdmin } = useUsersRole(); // Use the hook to check admin role
  const navigate = useNavigate();

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
    // Force update auth state immediately
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
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
      {/* Top Bar - Optimized for mobile */}
      <div className="bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1 sm:py-2 gap-1 sm:gap-2">
            {/* Currency Rate - Hidden on very small screens */}
            <div className="text-center sm:text-left order-2 sm:order-1">
              <span className="text-sm sm:text-base lg:text-lg font-medium sm:font-semibold">
                1 USD = 142.08 JPY
              </span>
            </div>

            {/* Time - Centered on mobile */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 order-1 sm:order-2">
              <Clock size={14} className="sm:size-4" />
              <span className="text-xs sm:text-sm">
                Japan Time: 05:39 AM, Thursday
              </span>
            </div>

            {/* Contact & Auth - Bottom on mobile */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm order-3">
              {/* Phone - Hidden on very small screens, shown on sm+ */}
              <a
                href="tel:+88-34-777-0000"
                className="hidden sm:flex items-center gap-1 hover:text-gray-200 transition-colors"
              >
                <Phone size={12} className="sm:size-3.5" />
                <span className="hidden md:inline">+88-34-777-0000</span>
                <span className="md:hidden">Call</span>
              </a>

              {authState.isAuthenticated ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-1 hover:text-gray-200 transition-colors"
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
                    className="hover:text-blue-800 transition-colors px-2 py-1 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <NavLink
                    to="/login"
                    className="hover:text-gray-200 transition-colors px-2 py-1 rounded"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="hover:text-gray-200 transition-colors px-2 py-1 rounded"
                  >
                    Register
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
                  className="h-8 sm:h-10 lg:h-12 w-auto ml-2"
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
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group text-sm xl:text-base"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            ))}
          </nav>

          {/* Icons & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <Link
              to="/wishlist"
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <Heart size={20} className="sm:size-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart size={20} className="sm:size-6" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* My Page button - Hidden on mobile, shown on desktop when authenticated */}
            {authState.isAuthenticated && (
              <Link to="/profile" className="hidden lg:block">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 xl:px-6 py-2 rounded-lg font-medium transition-colors text-sm xl:text-base">
                  My Page
                </button>
              </Link>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-3">
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

              {/* Phone number in mobile menu */}
              <a
                href="tel:+88-34-777-0000"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone size={16} />
                +88-34-777-0000
              </a>

              {/* My Page button in mobile menu when user is authenticated */}
              {authState.isAuthenticated && (
                <div className="pt-3 border-t border-gray-200">
                  <Link to="/profile">
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
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
