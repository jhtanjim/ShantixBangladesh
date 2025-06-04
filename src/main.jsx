import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom"; // ✅ Correct import
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./Context/AuthContext";
import { ShopProvider } from "./Context/ShopContext";
import { router } from "./Routes/Routes";
import './index.css'; // or './main.css' depending on your file

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ShopProvider>
          <RouterProvider router={router} />
        </ShopProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
