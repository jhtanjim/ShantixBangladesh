import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main.jsx";
import About from "../Pages/About/About.jsx";
import ContactUs from "../Pages/ContactUs/ContactUs.jsx";
import CarDetails from "../Pages/AllCar/CarDetails.jsx";
import Enquiry from "../Pages/Enquiry/Enquiry.jsx";
import Login from "../Pages/Auth/Login.jsx";
import Register from "../Pages/Auth/Register.jsx";
import Profile from "../Pages/Profile/Profile.jsx";
import UserProfile from "../Pages/Profile/UserProfile.jsx";
import UpdateProfile from "../Pages/Profile/UpdateProfile.jsx";
import { AdminLayout } from "../layout/AdminLayout.jsx";
import { Dashboard } from "../Pages/DashBoard/Admin/Dashboard.jsx";
import { CarsPage } from "../Pages/DashBoard/Admin/cars/CarsPage.jsx";
import { EditCarPage } from "../Pages/DashBoard/Admin/cars/EditCarPage.jsx";
import { UsersPage } from "../Pages/DashBoard/Admin/users/UsersPage.jsx";
import { CreateUserPage } from "../Pages/DashBoard/Admin/users/CreateUserPage.jsx";
import { EditUserPage } from "../Pages/DashBoard/Admin/users/EditUserPage.jsx";
import { CarDetailsPage } from "../Pages/DashBoard/Admin/cars/CarDetailsPage.jsx";
import AllCar from "../Pages/AllCar/AllCar.jsx";
import Cart from "../components/ui/Cart.jsx";
import Wishlist from "../components/ui/wishlist.jsx";
import Home from "../Pages/Home/Home.jsx";
import OrderPage from "../Pages/DashBoard/OrderPage/OrderPage.jsx";
import CreateCarPage from "../Pages/DashBoard/Admin/cars/CreateCarPage.jsx";

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
      // {
      //   path: "myPage",
      //   element: <MyPage />,
      // },
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
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
