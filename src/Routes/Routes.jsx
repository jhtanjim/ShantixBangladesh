import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import About from "../Pages/About/About";
import ContactUs from "../Pages/ContactUs/ContactUs";
import CarDetails from "../Pages/AllCar/CarDetails";
import Enquiry from "../Pages/Enquiry/Enquiry";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import Profile from "../Pages/Profile/Profile";
import UserProfile from "../Pages/Profile/UserProfile";
import UpdateProfile from "../Pages/Profile/UpdateProfile";
import { Dashboard } from "../Pages/DashBoard/Admin/Dashboard";
import { CarsPage } from "../Pages/DashBoard/Admin/cars/CarsPage";
import { EditCarPage } from "../Pages/DashBoard/Admin/cars/EditCarPage";
import { UsersPage } from "../Pages/DashBoard/Admin/users/UsersPage";
import { CreateUserPage } from "../Pages/DashBoard/Admin/users/CreateUserPage";
import { EditUserPage } from "../Pages/DashBoard/Admin/users/EditUserPage";
import { CarDetailsPage } from "../Pages/DashBoard/Admin/cars/CarDetailsPage";
import AllCar from "../Pages/AllCar/AllCar";
import Cart from "../components/ui/Cart";
import Wishlist from "../components/ui/wishlist";
import Home from "../Pages/Home/Home";
import OrderPage from "../Pages/DashBoard/OrderPage/OrderPage";
import CreateCarPage from "../Pages/DashBoard/Admin/cars/CreateCarPage";
import UnderConstruction from "../components/UnderConstruction/UnderConstruction";
import AdminRoute from "./AdminRoute";
import ShipSchedule from "../Pages/ShipSchedule/ShipSchedule";
import HowToBuy from "../Pages/HowToBuy/HowToBuy";
import AdminLayout from "../layout/AdminLayout";
import SignInwithForgetPass from "../Pages/Auth/SignInwithForgetPass";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/shipSchedule",
        element: <ShipSchedule />,
      },
      {
        path: "/howToBuy",
        element: <HowToBuy />,
      },
     
      {
        path: "/allCars",
        element: <AllCar />,
      },
      {
        path: "/cars/:id",
        element: <CarDetails />,
      },
      {
  path: "/cart",
  element: <Cart />,
},
      {
  path: "/cart",
  element: <Cart />,
},
      {
  path: "/wishlist",
  element: <Wishlist />,
},

      {
        path: "/enquiry",
        element: <Enquiry />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/login",
        element: <SignInwithForgetPass />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/users/:id",
        element: <UserProfile />,
      },
      {
        path: "/users/:id",
        element: <UserProfile />,
      },
      {
        path: "updateProfile",
        element: <UpdateProfile />,
      },
      {
        path: "privacyPolicy",
        element: <PrivacyPolicy />,
      },
      // {
      //   path: "myPage",
      //   element: <MyPage />,
      // },
      { path: "*", element: <UnderConstruction /> },
    ],

  },

  {
    path: "/admin",
    element:    
    <AdminRoute>
        <AdminLayout />
        </AdminRoute>
      ,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "cars", element: <CarsPage /> },
          { path: "cars/:id", element: <CarDetailsPage /> }, 

      { path: "cars/create", element: <CreateCarPage/> },
  
      { path: "cars/edit/:id", element: <EditCarPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "users/create", element: <CreateUserPage /> },
      { path: "users/:id/edit", element: <EditUserPage /> },
      { path: "orders", element: <OrderPage /> }

    ],
  },
]);
