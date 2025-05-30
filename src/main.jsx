import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./layout/layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import About from "./pages/About.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import ThemeProvider from "./context/ThemeProvider.jsx";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import CreateBlog from "./pages/blogs/CreateBlog.jsx";

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "/blogs/create-blog",
        element: (
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        ),
      },
      {
        path: "about",
        element: (
            <About />
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
