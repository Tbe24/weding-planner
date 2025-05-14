import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./components/service/CartContext";
import LandingPage from "./pages/landingPage";
import Aboutuspage from "./pages/Aboutuspage";
import Testimonialpage from "./pages/testimonalspage";
import ContactPage from "./pages/contactpage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./Dashboard";
import DetailsPage from "./pages/detailsPage";
import Vendor from "./pages/vendor";
import VendorsByCategory from "./pages/vendorsByCategory";
import Page404 from "./pages/404Page";
import PaymentConfirmation from "./components/service/PaymentConfirmation";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userType = localStorage.getItem("user_type") || "";
  const isAllowed = allowedRoles.some((role) => userType.includes(role));
  return isAllowed ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Global Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about-us" element={<Aboutuspage />} />
          <Route path="/Testimonal" element={<Testimonialpage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/register-vendor"
            element={<Navigate to="/sign-up" replace />}
          />
          <Route path="/services/*" element={<DetailsPage />} />
          <Route path="/vendor/:id" element={<Vendor />} />
          <Route
            path="/vendors/category/:categoryName"
            element={<VendorsByCategory />}
          />
          <Route
            path="/payment/confirmation"
            element={<PaymentConfirmation />}
          />

          {/* Protected route example*/}
          <Route path="/dashboard/*" element={<Dashboard />} />

          {/* Catch all route - redirects to 404 page */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
