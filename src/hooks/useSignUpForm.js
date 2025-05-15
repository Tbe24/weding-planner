import { useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL, ENDPOINTS } from "../config/api.config";

// Define Ethiopian phone number regex
// Matches numbers starting with 09 followed by 8 digits OR +251 followed by 9 digits
const ethiopianPhoneRegex = /^(09[0-9]{8}|\+251[0-9]{9})$/;

// Define common schema fields
const commonFields = {
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().regex(ethiopianPhoneRegex, {
    message:
      "Please enter a valid Ethiopian phone number (09XXXXXXXX or +251XXXXXXXXX)",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  role: z.enum(["CLIENT", "VENDOR"], {
    required_error: "Please select a role",
  }),
};

// Define validation schema using Zod for clients
const baseSchema = z
  .object({
    ...commonFields,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Define schema for vendors with additional fields
const vendorSchema = z
  .object({
    ...commonFields,
    businessName: z
      .string()
      .min(3, {
        message:
          "Business name must be at least 3 characters (Chapa payment requirement)",
      })
      .max(100, { message: "Business name must be less than 100 characters" }),
    categoryId: z.string().min(1, { message: "Please select a category" }),
    accountNumber: z
      .string()
      .regex(/^\d{13}$/, {
        message: "CBE account number must be exactly 13 digits",
      })
      .refine((val) => val.length === 13, {
        message: "CBE account number must be exactly 13 digits",
      }),
    tinNumber: z
      .string()
      .regex(/^\d{10}$/, {
        message: "TIN number must be exactly 10 digits",
      })
      .refine((val) => val.length === 10, {
        message: "TIN number must be exactly 10 digits",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Conditional schema based on role
export const signUpSchema = z.union([
  baseSchema.refine((data) => data.role !== "VENDOR", {
    message: "For Vendor role, business information is required",
    path: ["role"],
  }),
  vendorSchema,
]);

export const useSignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CLIENT", // Default role
    businessName: "",
    categoryId: "",
    accountNumber: "",
    tinNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if phone number is valid Ethiopian format
  const isValidEthiopianPhone = (phone) => {
    return ethiopianPhoneRegex.test(phone);
  };

  // Format phone number for display (add spaces for readability)
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";

    if (phone.startsWith("+251")) {
      // Format as +251 XX XXX XXXX
      return phone.replace(/(\+251)(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");
    } else if (phone.startsWith("09")) {
      // Format as 09XX XXX XXX
      return phone.replace(/(09)(\d{2})(\d{3})(\d{3})/, "$1$2 $3 $4");
    }

    return phone;
  };

  // Handle input changes and validate in real-time
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number to allow formatting while typing
    if (name === "phone") {
      // Remove any non-digit characters except the + sign at the beginning
      const cleanedValue = value.replace(/[^\d+]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Validate the field that changed
    try {
      if (name === "confirmPassword") {
        const result = signUpSchema.safeParse({
          ...formData,
          confirmPassword: value,
        });

        if (!result.success) {
          const fieldError = result.error.errors.find(
            (err) => err.path[0] === "confirmPassword"
          );
          if (fieldError) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: fieldError.message,
            }));
            return;
          }
        }

        // Clear error if validation passes
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        return;
      }

      // For vendor-specific fields, only validate when role is VENDOR
      if (
        (name === "businessName" ||
          name === "categoryId" ||
          name === "accountNumber" ||
          name === "tinNumber") &&
        formData.role !== "VENDOR"
      ) {
        return;
      }

      // Create a schema for this field
      let fieldSchema;
      if (formData.role === "VENDOR") {
        fieldSchema = z.object({ [name]: vendorSchema.shape[name] });
      } else {
        fieldSchema = z.object({ [name]: baseSchema.shape[name] });
      }

      // Validate the field
      fieldSchema.parse({
        [name]: name === "phone" ? value.replace(/\s/g, "") : value,
      });

      // Clear error if validation passes
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0];
        setErrors((prev) => ({ ...prev, [name]: fieldError.message }));
      }
    }

    // If role is changed, validate required fields for that role
    if (name === "role") {
      if (value === "VENDOR") {
        // Validate business fields when switching to VENDOR
        try {
          z.object({
            businessName: vendorSchema.shape.businessName,
            categoryId: vendorSchema.shape.categoryId,
          }).parse({
            businessName: formData.businessName,
            categoryId: formData.categoryId,
          });
          setErrors((prev) => ({
            ...prev,
            businessName: undefined,
            categoryId: undefined,
          }));
        } catch (error) {
          if (error instanceof z.ZodError) {
            const newErrors = {};
            error.errors.forEach((err) => {
              newErrors[err.path[0]] = err.message;
            });
            setErrors((prev) => ({ ...prev, ...newErrors }));
          }
        }
      } else {
        // Clear vendor-specific errors when switching to CLIENT
        setErrors((prev) => {
          const {
            businessName: _businessName,
            categoryId: _categoryId,
            accountNumber: _accountNumber,
            tinNumber: _tinNumber,
            ...rest
          } = prev;
          return rest;
        });
      }
    }
  };

  // Register user with the backend API
  const registerUser = async (userData) => {
    try {
      // Prepare the data for the API
      const apiData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role,
      };

      // Add vendor-specific fields if role is VENDOR
      if (userData.role === "VENDOR") {
        apiData.businessName = userData.businessName;
        apiData.categoryId = userData.categoryId;
        apiData.accountNumber = userData.accountNumber;
        apiData.tinNumber = userData.tinNumber;
        // Add a default value for serviceType to satisfy backend requirements
        apiData.serviceType = "Other"; // Default to "Other" since we removed the field
      }

      console.log(
        "Sending registration data to:",
        API_URL + ENDPOINTS.AUTH.REGISTER
      );
      console.log("Registration payload:", apiData);

      // Make the API call
      const response = await axios.post(
        API_URL + ENDPOINTS.AUTH.REGISTER,
        apiData
      );
      console.log("Registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in registration:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed. Please try again."
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate all fields based on role
      const schemaToUse =
        formData.role === "VENDOR" ? vendorSchema : baseSchema;
      schemaToUse.parse(formData);

      // If validation passes, submit the form
      setIsSubmitting(true);

      try {
        // Send data to backend
        const result = await registerUser(formData);

        // Handle successful submission
        console.log("Form submitted successfully:", result);
        setIsSuccess(true);

        // Show success toast
        toast.success("Account created successfully! Redirecting to login...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset form after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          role: "CLIENT",
          businessName: "",
          categoryId: "",
          accountNumber: "",
          tinNumber: "",
        });

        // If token is returned, store it
        if (result.token) {
          sessionStorage.setItem("token", result.token);
          if (result.user) {
            sessionStorage.setItem("userData", JSON.stringify(result.user));
            sessionStorage.setItem("userRole", result.user.role);
          }
          setTimeout(() => {
            navigate("/", {
              state: {
                message: "Registration successful!.",
              },
            });
          }, 3000);
        } else {
          // Redirect to login if no token
          setTimeout(() => {
            navigate("/login", {
              state: {
                message:
                  "Registration successful! Please sign in with your new account.",
              },
            });
          }, 3000);
        }
      } catch (apiError) {
        // Show error toast
        toast.error(apiError.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map errors to form fields
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);

        // Show validation error toast
        toast.error("Please fix the errors in the form", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle phone input focus to add country code
  const handlePhoneFocus = (e) => {
    if (!e.target.value) {
      setFormData((prev) => ({ ...prev, phone: "+251" }));
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
    handlePhoneFocus,
    formatPhoneNumber,
    isValidEthiopianPhone,
  };
};

export default useSignUpForm;
