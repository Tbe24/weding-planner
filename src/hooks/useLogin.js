/**
 * useLogin Custom Hook
 *
 * Manages:
 * - Login form state
 * - Form validation
 * - Authentication flow
 * - Error handling
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "./../services/api";

const useLogin = () => {
  const navigate = useNavigate();

  // Form state with "remember me" persistence
  const [formData, setFormData] = useState({
    email: localStorage.getItem("rememberedEmail") || "",
    password: "",
    rememberMe: !!localStorage.getItem("rememberedEmail"),
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  /**
   * Handles input changes and clears related errors
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (loginError) setLoginError("");
  };

  /**
   * Validates form inputs
   * @returns {boolean} True if valid
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submission
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      // Use authService instead of direct axios call
      const { data } = await authService.login({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Store auth data based on "remember me" selection
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));
      storage.setItem("userRole", data.user.role);
      // Conditionally remember email
      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/");
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error scenarios with more specific messages
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          // Handle validation errors or invalid credentials
          if (data.error === "Invalid credentials.") {
            errorMessage =
              "The email or password you entered is incorrect. Please try again.";
          } else if (data.error === "Email and password are required.") {
            errorMessage = "Email and password are required.";
          } else {
            errorMessage =
              data.error || data.message || "Invalid login details.";
          }
        } else if (status === 401) {
          errorMessage =
            "Your account is not authorized. Please contact support.";
        } else if (status === 403) {
          errorMessage =
            "Your account is blocked or inactive. Please contact support.";
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your internet connection.";
      }

      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    loginError,
    handleChange,
    handleSubmit,
  };
};

export default useLogin;
