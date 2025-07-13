import { createBrowserRouter } from "react-router-dom";
import About from "../Pages/About/About";
import Team from "../Pages/About/Team";
import AllCar from "../Pages/AllCar/AllCar";
import CarDetails from "../Pages/AllCar/CarDetails";
import Register from "../Pages/Auth/Register";
import SignInwithForgetPass from "../Pages/Auth/SignInwithForgetPass";
import ContactUs from "../Pages/ContactUs/ContactUs";
import { Dashboard } from "../Pages/DashBoard/Admin/Dashboard";
import EnquiryList from "../Pages/DashBoard/Admin/EnquiryList/EnquiryList";
import GalleryManagement from "../Pages/DashBoard/Admin/GalleryManagement/GalleryManagement";
import ShipScheduleList from "../Pages/DashBoard/Admin/ShipScheduleList/ShipScheduleList";
import TeamManagement from "../Pages/DashBoard/Admin/Team/TeamManageMent";
import { CarDetailsPage } from "../Pages/DashBoard/Admin/cars/CarDetailsPage";
import { CarForm } from "../Pages/DashBoard/Admin/cars/CarForm";
import { CarsPage } from "../Pages/DashBoard/Admin/cars/CarsPage";
import { CreateUserPage } from "../Pages/DashBoard/Admin/users/CreateUserPage";
import { EditUserPage } from "../Pages/DashBoard/Admin/users/EditUserPage";
import { UsersPage } from "../Pages/DashBoard/Admin/users/UsersPage";
import OrderPage from "../Pages/DashBoard/OrderPage/OrderPage";
import Enquiry from "../Pages/Enquiry/Enquiry";
import Home from "../Pages/Home/Home";
import HowToBuy from "../Pages/HowToBuy/HowToBuy";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import Profile from "../Pages/Profile/Profile";
import UpdateProfile from "../Pages/Profile/UpdateProfile";
import UserProfile from "../Pages/Profile/UserProfile";
import ShipSchedule from "../Pages/ShipSchedule/ShipSchedule";
import ShipScheduleDetails from "../Pages/ShipSchedule/ShipScheduleDetails";
import UnderConstruction from "../components/UnderConstruction/UnderConstruction";
import Cart from "../components/ui/Cart";
import Wishlist from "../components/ui/wishlist";
import AdminLayout from "../layout/AdminLayout";
import Main from "../layout/Main";
import AdminRoute from "./AdminRoute";

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
        path: "/team",
        element: <Team />,
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
        path: "/shipSchedule/:id",
        element: <ShipScheduleDetails />,
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
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "cars", element: <CarsPage /> },
      { path: "cars/:id", element: <CarDetailsPage /> },

      { path: "cars/create", element: <CarForm /> },

      { path: "cars/edit/:id", element: <CarForm /> },
      { path: "users", element: <UsersPage /> },
      { path: "users/create", element: <CreateUserPage /> },
      { path: "users/:id/edit", element: <EditUserPage /> },
      { path: "orders", element: <OrderPage /> },
      { path: "enquiryList", element: <EnquiryList /> },
      { path: "shipScheduleList", element: <ShipScheduleList /> },
      { path: "team", element: <TeamManagement /> },
      { path: "galleryManagement", element: <GalleryManagement /> },
    ],
  },
]);
