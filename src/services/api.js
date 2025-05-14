/**
 * API Service Layer
 *
 * Configures axios instance with:
 * - Base settings
 * - Authentication headers
 * - Global error handling
 */

import axios from "axios";
import { toast } from "react-toastify";
import { API_URL, ENDPOINTS } from "@/config/api.config";
import {
  authFetch,
  handleResponse,
} from "../Dashboard/dataProvider/customFetch";

// Configure axios instance
const api = axios.create({
  baseURL: API_URL, // Uses base URL from config
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 *
 * Automatically adds auth token to requests.
 * Runs before every API call.
 */
api.interceptors.request.use(
  (config) => {
    // Get token from storage (checks both localStorage and sessionStorage)
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * Handles global API errors.
 * Runs after every response.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Clear auth storage
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/login";
      toast.error("Your session has expired. Please login again.");
    }

    // Forward all errors
    return Promise.reject(error);
  }
);

// ======================
// SERVICE METHODS
// ======================

/**
 * Authentication Service
 */
export const authService = {
  login: (credentials) => api.post(ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => api.post(ENDPOINTS.AUTH.REGISTER, userData),
  validateToken: () => api.get(ENDPOINTS.AUTH.VALIDATE_TOKEN),
};

/**
 * User Service
 */
export const userService = {
  getProfile: () => api.get(ENDPOINTS.USER.PROFILE),
  updateProfile: (data) => api.put(ENDPOINTS.USER.UPDATE, data),
};

/**
 * Vendor Service
 */
export const vendorService = {
  register: (data) => api.post(ENDPOINTS.VENDOR.REGISTER, data),
  getServices: () => api.get(ENDPOINTS.VENDOR.SERVICES),
  getDashboardData: async () => {
    try {
      const response = await api.get(ENDPOINTS.VENDOR.DASHBOARD);
      return {
        ...response,
        data: response.data?.data || response.data || {},
      };
    } catch (error) {
      console.error("Error fetching vendor dashboard:", error);
      throw error;
    }
  },
  getDashboardOverview: async () => {
    try {
      const response = await api.get("/vendor/dashboard/overview");
      return response.data;
    } catch (error) {
      console.error("Error fetching vendor dashboard overview:", error);
      throw error;
    }
  },
  getConversations: () => api.get(ENDPOINTS.VENDOR.CONVERSATIONS),
  startConversation: (clientId) =>
    api.post(ENDPOINTS.VENDOR.CONVERSATIONS, { clientId }),
  getPayments: () => api.get(ENDPOINTS.VENDOR.PAYMENTS),
  getProfile: () => api.get(ENDPOINTS.VENDOR.ACCOUNT_PROFILE),
  updateAccount: (vendorId, data) => {
    const url = ENDPOINTS.VENDOR.ACCOUNT_UPDATE.replace(":id", vendorId);
    return api.patch(url, data);
  },
};

/**
 * Dashboard Service
 * Handles dashboard-specific API calls
 */
export const dashboardService = {
  getUserStats: () => api.get(ENDPOINTS.DASHBOARD.USER_STATS),
  getBookings: (params) => api.get(ENDPOINTS.DASHBOARD.BOOKINGS, { params }),
  getEvents: (params) => api.get(ENDPOINTS.DASHBOARD.EVENTS, { params }),
  getNotifications: () => api.get(ENDPOINTS.DASHBOARD.NOTIFICATIONS),
};

/**
 * Client Service
 * Handles client-specific API calls
 */
export const clientService = {
  /**
   * Fetches client dashboard data
   * Returns totalPaymentAmount, payments, and bookings information
   */
  getDashboardData: () => api.get(ENDPOINTS.CLIENT.DASHBOARD),

  /**
   * Fetches client bookings with pagination
   * @param {Object} params - Query parameters for pagination and filtering
   * @returns {Promise} - Promise with bookings data
   */
  getBookings: (params = {}) => api.get(ENDPOINTS.CLIENT.BOOKINGS, { params }),

  /**
   * Fetches client payments with pagination
   * @param {Object} params - Query parameters for pagination and filtering
   * @returns {Promise} - Promise with payments data
   */
  getPayments: (params = {}) => api.get(ENDPOINTS.CLIENT.PAYMENTS, { params }),

  /**
   * Updates user account information including password
   * @param {string} userId - The ID of the user to update
   * @param {Object} data - The user data to update
   * @returns {Promise} - Promise with updated user data
   */
  updateAccount: (userId, data) => {
    const url = ENDPOINTS.CLIENT.ACCOUNT_UPDATE.replace(":id", userId);
    return api.patch(url, data);
  },

  /**
   * Fetches the current user's profile information
   * @returns {Promise} - Promise with user profile data
   */
  getProfile: () => api.get(ENDPOINTS.CLIENT.PROFILE),

  /**
   * Fetches available services with pagination
   * @param {Object} params - Query parameters for pagination and filtering
   * @returns {Promise} - Promise with services data
   */
  getServices: (params = {}) => api.get(ENDPOINTS.CLIENT.SERVICES, { params }),

  /**
   * Fetches all service categories
   * @returns {Promise} - Promise with service categories data
   */
  getServiceCategories: () => api.get(ENDPOINTS.CLIENT.SERVICE_CATEGORIES),

  /**
   * Fetches vendors by category name
   * @param {string} categoryName - The name of the category
   * @returns {Promise} - Promise with vendors data
   */
  getVendorsByCategory: (categoryName) => {
    const url = ENDPOINTS.CLIENT.VENDORS_BY_CATEGORY.replace(
      ":categoryName",
      encodeURIComponent(categoryName)
    );
    return api.get(url);
  },

  /**
   * Fetches vendor details by ID
   * @param {string} id - The ID of the vendor
   * @returns {Promise} - Promise with vendor data
   */
  getVendorById: (id) => {
    const url = ENDPOINTS.CLIENT.VENDOR_BY_ID.replace(":id", id);
    return api.get(url);
  },

  /**
   * Creates a new booking for a service
   * @param {Object} bookingData - Data for the new booking (serviceId, eventDate, location, etc.)
   * @returns {Promise} - Promise with created booking data
   */
  createBooking: (bookingData) =>
    api.post(ENDPOINTS.CLIENT.CREATE_BOOKING, bookingData),

  /**
   * Initiates a payment transaction for a booking
   * @param {Object} paymentData - Data for the payment (amount, vendorId, bookingId)
   * @returns {Promise} - Promise with payment data including checkout URL
   */
  initiatePayment: (paymentData) =>
    api.post(ENDPOINTS.CLIENT.PAYMENT_INITIATE, paymentData),

  /**
   * Verifies a payment status
   * @param {Object} data - Contains tx_ref and paymentId
   * @returns {Promise} - Promise with payment verification details and updated status
   */
  verifyPayment: (data) => api.post(ENDPOINTS.CLIENT.PAYMENT_VERIFY, data),

  /**
   * Gets all conversations for the current client
   * @returns {Promise} - Promise with conversations data
   */
  getConversations: () => api.get(ENDPOINTS.CLIENT.CONVERSATIONS),

  /**
   * Starts a new conversation with a vendor
   * @param {Object} data - Contains vendorId to start conversation with
   * @returns {Promise} - Promise with created conversation data
   */
  startConversation: (data) =>
    api.post(ENDPOINTS.CLIENT.START_CONVERSATION, data),
};

export const adminService = {
  // Dashboard Overview
  getOverview: () => api.get("/admin/dashboard/overview"),

  // Admin profile
  getProfile: () => api.get("/user/profile"),
  updateAccount: (userId, data) => api.patch(`/user/update/${userId}`, data),

  // Event Planners
  getEventPlanners: (params) => api.get("/admin/event-planners", { params }),
  getEventPlanner: (id) => api.get(`/admin/event-planners/${id}`),
  createEventPlanner: (data) => api.post("/admin/event-planners", data),
  updateEventPlanner: async (id, data) => {
    const response = await authFetch(`/admin/event-planners/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  deleteEventPlanner: (id) => api.delete(`/admin/event-planners/${id}`),

  // Users (Clients)
  getClients: (params) => api.get("/admin/clients", { params }),
  getClient: (id) => api.get(`/admin/clients/${id}`),
  createClient: (data) => api.post("/admin/clients", data),
  updateClient: (id, data) => api.patch(`/admin/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/admin/clients/${id}`),
  changeClientPassword: (id, password) =>
    api.patch(`/admin/clients/${id}/password`, { password }),

  // Vendors
  getVendors: async (params = {}) => {
    // Create URL with query parameters
    const queryParams = new URLSearchParams();

    // Add all parameters to the query
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/admin/vendors${queryString ? `?${queryString}` : ""}`;

    console.log(`Getting vendors from endpoint: ${endpoint}`);

    try {
      const response = await authFetch(endpoint);
      const result = await handleResponse(response);

      // Ensure data is always an array
      if (!result.data) {
        result.data = [];
      } else if (!Array.isArray(result.data)) {
        // If it's not an array but has a data property that is an array
        if (result.data.data && Array.isArray(result.data.data)) {
          result.data = result.data.data;
        } else {
          result.data = [result.data];
        }
      }

      return result;
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
  },
  getVendor: (id) => api.get(`/admin/vendors/${id}`),
  updateVendor: async (id, data) => {
    const response = await authFetch(`/admin/vendors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  deleteVendor: (id) => api.delete(`/admin/vendors/${id}`),
  approveVendor: async (id) => {
    const response = await authFetch(`/admin/vendors/${id}/approve`, {
      method: "POST",
    });
    return handleResponse(response);
  },
  suspendVendor: async (id) => {
    const response = await authFetch(`/admin/vendors/${id}/suspend`, {
      method: "POST",
    });
    return handleResponse(response);
  },
  toggleVendorBlock: async (id, blocked) => {
    const response = await authFetch(`/admin/vendors/${id}/block`, {
      method: "PATCH",
      body: JSON.stringify({ blocked }),
    });
    return handleResponse(response);
  },
  getVendorById: async (id) => {
    const response = await authFetch(`/admin/vendors/${id}`);
    return handleResponse(response);
  },

  // Payments
  getPayments: (params) => api.get("/admin/payments", { params }),
  getPayment: (id) => api.get(`/admin/payments/${id}`),

  // Feedback
  getFeedbacks: (params) => api.get("/admin/feedback", { params }),
  getFeedback: (id) => api.get(`/admin/feedback/${id}`),

  // Service Categories
  getServiceCategories: () => api.get("/admin/service-categories"),
  getServiceCategoryById: (id) => api.get(`/admin/service-categories/${id}`),
  createServiceCategory: (formData) => {
    return api.post("/admin/service-categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateServiceCategory: (id, formData) => {
    return api.patch(`/admin/service-categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteServiceCategory: (id) => api.delete(`/admin/service-categories/${id}`),
};

/**
 * Event Planner Service
 * Handles event planner-specific API calls
 */
export const eventPlannerService = {
  /**
   * Fetches the event planner's profile information
   * @returns {Promise} - Promise with user profile data
   */
  getProfile: () => api.get("/eventplanner/account/profile"),

  /**
   * Updates event planner account information including password
   * @param {string} userId - The ID of the user to update
   * @param {Object} data - The user data to update
   * @returns {Promise} - Promise with updated user data
   */
  updateAccount: (userId, data) => {
    return api.patch(`/eventplanner/account/${userId}`, data);
  },

  /**
   * Updates a vendor's information
   * @param {string} id - Vendor ID
   * @param {Object} data - Data to update (businessName, description, serviceType)
   * @returns {Promise} - Promise with updated vendor data
   */
  updateVendor: (id, data) => {
    return api.patch(`/eventplanner/vendors/${id}`, data);
  },

  /**
   * Updates a vendor's status
   * @param {string} id - Vendor ID
   * @param {string} status - New status (PENDING_APPROVAL, APPROVED, SUSPENDED)
   * @returns {Promise} - Promise with update result
   */
  updateVendorStatus: (id, status) => {
    return api.patch(`/eventplanner/vendors/${id}/status`, { status });
  },

  /**
   * Block or unblock a vendor
   * @param {string} id - Vendor ID
   * @param {boolean} blocked - Whether to block (true) or unblock (false)
   * @returns {Promise} - Promise with update result
   */
  toggleVendorBlock: (id, blocked) => {
    return api.patch(`/eventplanner/vendors/${id}/block`, { blocked });
  },

  /**
   * Report a vendor
   * @param {string} id - Vendor ID
   * @param {string} reason - Reason for reporting
   * @returns {Promise} - Promise with update result
   */
  reportVendor: (id, reason) => {
    return api.patch(`/eventplanner/vendors/${id}/report`, { reason });
  },

  /**
   * Block or unblock a client
   * @param {string} id - Client ID
   * @param {boolean} blocked - Whether to block (true) or unblock (false)
   * @returns {Promise} - Promise with update result
   */
  toggleClientBlock: (id, blocked) => {
    return api.patch(`/eventplanner/clients/${id}/block`, { blocked });
  },

  /**
   * Report a client
   * @param {string} id - Client ID
   * @param {string} reason - Reason for reporting
   * @returns {Promise} - Promise with update result
   */
  reportClient: (id, reason) => {
    return api.patch(`/eventplanner/clients/${id}/report`, { reason });
  },
};

export default api;
