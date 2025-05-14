/**
 * API Configuration File
 *
 * Centralizes all API endpoint paths and base URL configuration.
 * Uses environment variables for deployment flexibility.
 */

import { API_BASE_URL } from "./env";

// Base API URL
export const API_URL = API_BASE_URL;

/**
 * Endpoint Definitions
 *
 * Organized by domain (AUTH, USER, etc.) for better maintainability.
 * All paths are relative to API_URL.
 */
export const ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VALIDATE_TOKEN: "/auth/validate-token",
  },

  // User management endpoints
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
  },

  // Vendor-specific endpoints
  VENDOR: {
    REGISTER: "/vendor/register",
    SERVICES: "/vendor/services",
    DASHBOARD: "/vendor/dashboard/overview",
    CONVERSATIONS: "/vendor/conversations",
    PAYMENTS: "/vendor/payment",
    ACCOUNT_PROFILE: "/vendor/account/profile",
    ACCOUNT_UPDATE: "/vendor/account/:id",
  },

  // Dashboard endpoints
  DASHBOARD: {
    USER_STATS: "/dashboard/user-stats",
    BOOKINGS: "/dashboard/bookings",
    EVENTS: "/dashboard/events",
    NOTIFICATIONS: "/dashboard/notifications",
  },

  // Client specific endpoints
  CLIENT: {
    DASHBOARD: "/client/dashboard",
    BOOKINGS: "/client/bookings",
    PAYMENTS: "/client/payment",
    ACCOUNT_UPDATE: "/client/account/:id",
    PROFILE: "/client/account/profile",
    SERVICES: "/client/services",
    SERVICE_CATEGORIES: "/client/service-categories",
    VENDORS_BY_CATEGORY: "/client/vendors/category/:categoryName",
    VENDOR_BY_ID: "/client/vendors/:id",
    CREATE_BOOKING: "/client/bookings",
    PAYMENT_INITIATE: "/client/payment/initiate",
    PAYMENT_VERIFY: "/client/payment/verify",
    CONVERSATIONS: "/client/conversations",
    START_CONVERSATION: "/client/conversations",
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    VENDORS: "/admin/vendors",
    BOOKINGS: "/admin/bookings",
    PAYMENTS: "/admin/payments",
    FEEDBACK: "/admin/feedback",
  },
};

// Export a function to get a full URL for a given endpoint
export const getApiUrl = (endpoint) => `${API_URL}${endpoint}`;
