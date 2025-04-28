import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main.tsx"
import Home from "../Pages/Home/Home.tsx";
export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children :[
        {
          path:"/",
          element:<Home/>
        }
      ]
    },
  ]);