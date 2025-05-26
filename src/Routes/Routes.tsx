import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main.tsx";
import Home from "../Pages/Home/Home.tsx";
import About from "../Pages/About/About.tsx";
import ContactUs from "../Pages/ContactUs/ContactUs.tsx";
import AllCar from "../Pages/AllCar/AllCar.tsx";
import CarDetails from "../Pages/AllCar/CarDetails.tsx";
import Enquiry from "../Pages/Enquiry/Enquiry.tsx";
import Login from "../Pages/Auth/Login.tsx";
import Register from "../Pages/Auth/Register.tsx";
import Profile from "../Pages/Profile/Profile.tsx";
import UserProfile from "../Pages/Profile/UserProfile.tsx";
import UpdateProfile from "../Pages/Profile/UpdateProfile.tsx";
import { AdminLayout } from "../layout/AdminLayout.tsx";
import { Dashboard } from "../Pages/DashBoard/Admin/Dashboard.tsx";
import { CarsPage } from "../Pages/DashBoard/Admin/cars/CarsPage.tsx";
import { CreateCarPage } from "../Pages/DashBoard/Admin/cars/CreateCarPage.tsx";
import { EditCarPage } from "../Pages/DashBoard/Admin/cars/EditCarPage.tsx";
import { UsersPage } from "../Pages/DashBoard/Admin/users/UsersPage.tsx";
import { CreateUserPage } from "../Pages/DashBoard/Admin/users/CreateUserPage.tsx";
import { EditUserPage } from "../Pages/DashBoard/Admin/users/EditUserPage.tsx";
import { CarDetailsPage } from "../Pages/DashBoard/Admin/cars/CarDetailsPage.tsx";

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
        path: "/contactUs",
        element: <ContactUs />,
      },
      {
        path: "/allCars",
        element: <AllCar />,
      },
      {
        path: "/carDetails",
        element: <CarDetails />,
      },
      {
        path: "/enquiry",
        element: <Enquiry />,
      },
      {
        path: "/login",
        element: <Login />,
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
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "cars", element: <CarsPage /> },
          { path: "cars/:id", element: <CarDetailsPage /> }, 

      { path: "cars/create", element: <CreateCarPage /> },
      { path: "cars/edit/:id", element: <EditCarPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "users/create", element: <CreateUserPage /> },
      { path: "users/:id/edit", element: <EditUserPage /> },
    ],
  },
]);
