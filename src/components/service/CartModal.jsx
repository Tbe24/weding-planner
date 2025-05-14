import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "./CartContext";
import { toast } from "react-toastify";
import { clientService } from "../../services/api";

const CartModal = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, removeFromCart, clearCart } = useCartContext();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Check if user is logged in
  const isLoggedIn = () => {
    // Check for token in both localStorage and sessionStorage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    // Check for user role to ensure we have a valid client user
    const userRole =
      localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

    console.log("Auth check - Token:", !!token, "Role:", userRole);

    return !!token;
  };

  // Create a booking for a cart item
  const createBooking = async (cartItem) => {
    try {
      console.log("Creating booking for cart item:", cartItem);

      // Create booking data object
      const bookingData = {
        serviceId: cartItem.id,
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 1 week from now
        location: "To be confirmed", // Default location
        attendees: 50, // Default attendees
        specialRequests: cartItem.description || "",
      };

      console.log("Booking data:", bookingData);

      // Create the booking using the API
      const response = await clientService.createBooking(bookingData);
      console.log("Booking created:", response.data.booking);
      return response.data.booking;
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(
        `Failed to create booking: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  };

  // Initiate payment for a booking
  const initiatePayment = async (booking) => {
    try {
      console.log("Initiating payment for booking:", booking);

      // Prepare payment data
      const paymentData = {
        amount: booking.service.price,
        vendorId: booking.service.vendor.id,
        bookingId: booking.id,
      };

      console.log("Payment data:", paymentData);

      // Call payment initiation API
      const paymentResponse = await clientService.initiatePayment(paymentData);
      console.log("Payment initiated:", paymentResponse.data);
      return paymentResponse.data;
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error(
        `Failed to initiate payment: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  };

  const handleContinueShopping = () => {
    onClose();
    navigate("/");
  };

  const handleCheckout = async () => {
    console.log("Checkout button clicked, checking login status...");
    const loggedIn = isLoggedIn();
    console.log("User logged in:", loggedIn);

    if (loggedIn) {
      // If user is logged in, create bookings and initiate payment
      setIsProcessing(true);
      try {
        console.log("Processing cart items:", cartItems);

        // Create bookings for all cart items
        const bookingPromises = await cartItems.map(createBooking);
        const bookings = await Promise.all(bookingPromises);
        console.log("All bookings created:", bookings);

        if (bookings.length === 0) {
          throw new Error("No bookings were created");
        }

        // Initiate payment for the first booking
        // (In a real app, you might want to handle multiple bookings differently)
        const paymentData = await initiatePayment(bookings[0]);
        console.log("Payment data received:", paymentData);

        if (!paymentData || !paymentData.checkoutUrl) {
          throw new Error("Invalid payment data received");
        }

        // Clear the cart
        clearCart();

        // Close the modal
        onClose();

        // Show success message
        toast.info("Redirecting to payment page...");

        // Store payment info in sessionStorage for the confirmation page
        sessionStorage.setItem("payment_tx_ref", paymentData.tx_ref);
        sessionStorage.setItem("payment_id", paymentData.paymentId);

        console.log("Redirecting to:", paymentData.checkoutUrl);

        // Redirect to Chapa checkout page
        window.location.href = paymentData.checkoutUrl;
      } catch (error) {
        console.error("Error processing checkout:", error);
        toast.error(
          `Checkout failed: ${error.response?.data?.message || error.message}`
        );
        setIsProcessing(false);
      }
    } else {
      // If user is not logged in, navigate to login page
      console.log("User not logged in, redirecting to login page");
      toast.info("Please log in to complete your purchase");
      navigate("/login");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Your Cart
                </h3>

                {cartItems.length === 0 ? (
                  <div className="mt-4 text-gray-500">Your cart is empty.</div>
                ) : (
                  <>
                    <div className="mt-4 space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.type}-${item.id}`}
                          className="flex justify-between items-center border-b pb-3"
                        >
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500">
                              {item.vendorName}
                            </p>
                            <p className="text-wedding-purple font-medium">
                              ${item.price.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 border-t pt-4">
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>${cartTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Payment Option:</h4>
                      <div className="border rounded p-3 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <img
                            src="/chapa-logo.png"
                            alt="Chapa Payment"
                            className="h-10 object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://chapa.co/assets/images/chapa_logo.svg";
                            }}
                          />
                          <span className="text-sm font-medium mt-1">
                            Pay with Chapa
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6  sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-wedding-purple text-base font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wedding-purple sm:ml-3 sm:w-auto sm:text-sm ${
                cartItems.length === 0 || isProcessing
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : isLoggedIn() ? (
                "Pay Now"
              ) : (
                "Proceed to Checkout"
              )}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wedding-purple sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleContinueShopping}
              disabled={isProcessing}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
