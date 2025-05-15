import React, { useState, useEffect } from "react";
import { useCartContext } from "./CartContext";
import useBooking from "../../hooks/useBooking";
import { useNavigate } from "react-router-dom";

const CartModal = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, removeFromCart, clearCart } = useCartContext();
  const { processCartCheckout, loading: isProcessing, error } = useBooking();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    eventDate: "",
    location: "",
    attendees: "",
    specialRequests: "",
  });
  const [formErrors, setFormErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!bookingDetails.eventDate) {
      errors.eventDate = "Event date is required";
    } else {
      const selectedDate = new Date(bookingDetails.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.eventDate = "Event date must be in the future";
      }
    }

    if (!bookingDetails.location) {
      errors.location = "Location is required";
    }

    if (bookingDetails.attendees && isNaN(Number(bookingDetails.attendees))) {
      errors.attendees = "Attendees must be a number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login?redirect=cart");
      return;
    }

    setShowBookingForm(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await processCartCheckout(cartItems, bookingDetails);

      console.log('Checkout result:', result);

      // If payment URL is available, redirect to payment
      if (result.payment && result.payment.checkoutUrl) {
        // Clear cart before redirecting to payment
        clearCart();
        window.location.href = result.payment.checkoutUrl;
      } else if (result.booking && result.booking.id) {
        // Otherwise redirect to booking confirmation
        clearCart();
        navigate(`/booking-confirmation/${result.booking.id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      // Error is handled by the hook and displayed in the UI
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
                  {showBookingForm ? "Booking Details" : "Your Cart"}
                </h3>

                {error && (
                  <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                  </div>
                )}

                {!showBookingForm && (
                  <>
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
                                disabled={isProcessing}
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
                  </>
                )}

                {showBookingForm && (
                  <form onSubmit={handleSubmitBooking} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                          Event Date *
                        </label>
                        <input
                          type="date"
                          id="eventDate"
                          name="eventDate"
                          value={bookingDetails.eventDate}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border ${
                            formErrors.eventDate ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-wedding-purple focus:border-wedding-purple`}
                          required
                        />
                        {formErrors.eventDate && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.eventDate}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location *
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={bookingDetails.location}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border ${
                            formErrors.location ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-wedding-purple focus:border-wedding-purple`}
                          required
                        />
                        {formErrors.location && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="attendees" className="block text-sm font-medium text-gray-700">
                          Number of Attendees
                        </label>
                        <input
                          type="number"
                          id="attendees"
                          name="attendees"
                          value={bookingDetails.attendees}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border ${
                            formErrors.attendees ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-wedding-purple focus:border-wedding-purple`}
                        />
                        {formErrors.attendees && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.attendees}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
                          Special Requests
                        </label>
                        <textarea
                          id="specialRequests"
                          name="specialRequests"
                          value={bookingDetails.specialRequests}
                          onChange={handleInputChange}
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-wedding-purple focus:border-wedding-purple"
                        ></textarea>
                      </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>${cartTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {!showBookingForm ? (
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-wedding-purple text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wedding-purple sm:ml-3 sm:w-auto sm:text-sm ${
                  cartItems.length === 0 || isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleProceedToCheckout}
                disabled={cartItems.length === 0 || isProcessing}
              >
                Proceed to Checkout
              </button>
            ) : (
              <button
                type="submit"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-wedding-purple text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wedding-purple sm:ml-3 sm:w-auto sm:text-sm ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSubmitBooking}
                disabled={isProcessing}
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
                ) : (
                  "Complete Booking"
                )}
              </button>
            )}

            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wedding-purple sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={showBookingForm ? () => setShowBookingForm(false) : onClose}
              disabled={isProcessing}
            >
              {showBookingForm ? "Back to Cart" : "Continue Shopping"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
