import { useState } from 'react';
import axios from 'axios';
import { API_URL, ENDPOINTS } from '../config/api.config';

/**
 * Custom hook for handling booking-related operations
 * @returns {Object} Booking methods and state
 */
const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  // Get token from storage
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  /**
   * Create a new booking for a service
   * @param {Object} bookingData - The booking data
   * @param {string} bookingData.serviceId - ID of the service to book
   * @param {string} bookingData.eventDate - Date of the event
   * @param {string} bookingData.location - Location of the event
   * @param {number} [bookingData.attendees] - Number of attendees (optional)
   * @param {string} [bookingData.specialRequests] - Special requests (optional)
   * @returns {Promise<Object>} The created booking
   */
  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    setBookingResult(null);

    try {
      const token = await getToken()
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.CLIENT.CREATE_BOOKING}`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setBookingResult(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiate payment for a booking
   * @param {Object} paymentData - The payment data
   * @param {string} paymentData.bookingId - ID of the booking to pay for
   * @param {string} paymentData.vendorId - ID of the vendor
   * @param {string} paymentData.userId - ID of the user making the payment
   * @param {number} paymentData.amount - Amount to pay
   * @param {string} paymentData.currency - Currency code (default: 'ETB')
   * @param {string} paymentData.returnUrl - URL to redirect after payment
   * @returns {Promise<Object>} Payment initiation result with checkout URL
   */
  const initiatePayment = async (paymentData) => {
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = ['bookingId', 'vendorId', 'userId', 'amount'];
      const missingFields = requiredFields.filter(field => !paymentData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required payment fields: ${missingFields.join(', ')}`);
      }

      console.log('Initiating payment with data:', paymentData);

      const response = await axios.post(
        `${API_URL}${ENDPOINTS.CLIENT.PAYMENT_INITIATE}`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Payment initiation response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Payment initiation error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to initiate payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all bookings for the current user
   * @param {string} [type='upcoming'] - Type of bookings to fetch ('upcoming' or 'past')
   * @param {number} [page=1] - Page number for pagination
   * @param {number} [limit=10] - Number of items per page
   * @returns {Promise<Object>} Bookings with pagination info
   */
  const getBookings = async (type = 'upcoming', page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_URL}${ENDPOINTS.CLIENT.BOOKINGS}?type=${type}&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch bookings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Process checkout for cart items
   * @param {Array} cartItems - Array of cart items
   * @param {Object} bookingDetails - Common booking details for all items
   * @returns {Promise<Object>} Result with booking and payment info
   */
  const processCartCheckout = async (cartItems, bookingDetails) => {
    setLoading(true);
    setError(null);

    try {
      // Create a booking for the first cart item
      // In a real app, you might want to create multiple bookings or a single booking with multiple items
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const item = cartItems[0];

      // Create the booking
      const bookingResponse = await createBooking({
        serviceId: item.id,
        ...bookingDetails
      });

      console.log('Booking response:', bookingResponse);

      // Extract the booking data from the response
      const booking = bookingResponse.booking;

      if (!booking || !booking.id) {
        throw new Error('Invalid booking response from server');
      }

      // Get the user ID from storage
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      let userId = null;

      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      // Initiate payment with all required fields
      const paymentResult = await initiatePayment({
        bookingId: booking.id,
        vendorId: booking.vendor.id,
        userId: userId,
        amount: item.price,
        currency: 'ETB',
        returnUrl: `${window.location.origin}/booking-confirmation/${booking.id}`
      });

      return {
        booking: booking,
        payment: paymentResult,
      };
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process checkout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    bookingResult,
    createBooking,
    initiatePayment,
    getBookings,
    processCartCheckout
  };
};

export default useBooking;
