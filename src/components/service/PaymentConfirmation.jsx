import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clientService } from "../../services/api";

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [status, setStatus] = useState("PENDING");

  // Helper function to get URL parameters
  const getParamFromUrl = (paramName) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(paramName);
  };

  // Try to get payment info from URL parameters first, then from sessionStorage
  const tx_ref =
    getParamFromUrl("tx_ref") || sessionStorage.getItem("payment_tx_ref");
  const paymentId =
    getParamFromUrl("payment_id") || sessionStorage.getItem("payment_id");

  // Clear session storage after retrieving values
  useEffect(() => {
    if (
      sessionStorage.getItem("payment_tx_ref") ||
      sessionStorage.getItem("payment_id")
    ) {
      sessionStorage.removeItem("payment_tx_ref");
      sessionStorage.removeItem("payment_id");
    }
  }, []);

  // Log actual raw URL for debugging
  useEffect(() => {
    console.log("Raw URL search string:", location.search);
    console.log("Detected tx_ref:", tx_ref);
    console.log("Detected payment_id:", paymentId);
  }, [location.search, tx_ref, paymentId]);

  const verifyPaymentStatus = async () => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);

    try {
      if (!tx_ref || !paymentId) {
        setError("Missing payment information in the URL");
        setErrorDetails({
          message: "The URL is missing required parameters",
          tx_ref: tx_ref || "Missing",
          paymentId: paymentId || "Missing",
          rawUrl: location.search || "Empty search params",
        });
        setLoading(false);
        return;
      }

      const response = await clientService.verifyPayment({
        tx_ref,
        paymentId,
      });

      setPaymentDetails(response.data);
      setStatus(response.data.status);
      setLoading(false);

      // Show toast based on payment status
      if (response.data.status === "COMPLETED") {
        toast.success("Payment completed successfully!");
      } else if (response.data.status === "FAILED") {
        toast.error("Payment failed. Please try again.");
      } else {
        toast.info("Payment is still processing.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError("Failed to verify payment status");
      setErrorDetails({
        message: error.message,
        response: error.response?.data,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPaymentStatus();

    // Poll for payment status updates every 5 seconds if still pending
    const intervalId = setInterval(async () => {
      if (status === "PENDING") {
        try {
          const response = await clientService.verifyPayment({
            tx_ref,
            paymentId,
          });

          setPaymentDetails(response.data);
          setStatus(response.data.status);

          if (response.data.status !== "PENDING") {
            clearInterval(intervalId);
            if (response.data.status === "COMPLETED") {
              toast.success("Payment completed successfully!");
            } else if (response.data.status === "FAILED") {
              toast.error("Payment failed. Please try again.");
            }
          }
        } catch (error) {
          console.error("Polling error:", error);
          clearInterval(intervalId);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [tx_ref, paymentId, status]);

  const handleViewDashboard = () => {
    navigate("/dashboard");
  };

  const handleBrowseServices = () => {
    navigate("/services");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-16 h-16 border-4 border-wedding-purple border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          Verifying payment...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we confirm your payment status.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Payment Verification Error
          </h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleViewDashboard}
              className="w-full py-2 bg-wedding-purple text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleBrowseServices}
              className="w-full py-2 border border-wedding-purple text-wedding-purple rounded-md hover:bg-purple-50 transition-colors"
            >
              Browse Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {status === "COMPLETED" ? (
          <>
            <div className="text-green-500 flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Your payment has been processed successfully. The vendor has been
              notified.
            </p>
          </>
        ) : status === "PENDING" ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Payment Processing
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Your payment is being processed. This page will update
              automatically once complete.
            </p>
          </>
        ) : (
          <>
            <div className="text-red-500 flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 text-center mb-6">
              We couldn't process your payment. Please try again or contact
              support if the issue persists.
            </p>
          </>
        )}

        {paymentDetails && (
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">
              Payment Details
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Transaction Reference:</div>
              <div className="font-medium">{tx_ref}</div>
              <div className="text-gray-500">Amount:</div>
              <div className="font-medium">
                ETB {paymentDetails.amount?.toLocaleString() || "N/A"}
              </div>
              <div className="text-gray-500">Status:</div>
              <div
                className={`font-medium ${
                  status === "COMPLETED"
                    ? "text-green-600"
                    : status === "PENDING"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {status}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleViewDashboard}
            className="w-full py-2 bg-wedding-purple text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={handleBrowseServices}
            className="w-full py-2 border border-wedding-purple text-wedding-purple rounded-md hover:bg-purple-50 transition-colors"
          >
            Browse Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
