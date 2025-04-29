import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main.tsx"
import Home from "../Pages/Home/Home.tsx";
import About from "../Pages/About/About.tsx";
import ContactUs from "../Pages/ContactUs/ContactUs.tsx";
import AllCar from "../Pages/AllCar/AllCar.tsx";
import CarDetails from "../Pages/AllCar/CarDetails.tsx";
import Enquiry from "../Pages/Enquiry/Enquiry.tsx";
export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children :[
        {
          path:"/",
          element:<Home/>
        },
        {
          path:"/about",
          element:<About/>
        },
        {
          path:"/contactUs",
          element:<ContactUs/>
        },
        {
          path:"/allCars",
          element:<AllCar/>
        },
        {
          path:"/carDetails",
          element:<CarDetails/>
        },
        {
          path:"/enquiry",
          element:<Enquiry/>
        },
      ]
    },
  ]);