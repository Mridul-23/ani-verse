import {
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import "./index.css";
import App from "./App.jsx";
import Auth from "./components/Auth/Auth.jsx";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Auth/Login.jsx";
import About from "./components/About/About.jsx";
import Search from "./components/Search/Search.jsx";
import Register from "./components/Auth/Register.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Start from "./components/Recommendation/Start.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import AnimeDetails from "./components/AnimeDetails/AnimeDetails.jsx";
import Recommendation from "./components/Recommendation/Recommendation.jsx";
import Initialization from "./components/Recommendation/Initialization.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="about" element={<About />} />
      <Route path="explore" element={<Search />} />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="contact" element={<Contact />} />
      <Route path="auth" element={<Auth />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route
        path="recommendation"
        element={
          <ProtectedRoute>
            <Recommendation />
          </ProtectedRoute>
        }
      >
        <Route path="start" element={<Start />} />
        <Route path="init" element={<Initialization />} />
      </Route>
      <Route 
        path="/anime/details/:id" 
        element={
          <ProtectedRoute>
            <AnimeDetails />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
