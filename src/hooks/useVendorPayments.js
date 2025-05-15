import { useState, useCallback, useEffect } from "react";
import api, { vendorService } from "../services/api";
import { toast } from "react-toastify";

const useVendorPayments = () => {
  const [payments, setPayments] = useState({
    receivedPayments: [],
    pendingPayments: [],
    totalPayments: 0,
    vendorId: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await vendorService.getPayments();

      if (response.data.success) {
        setPayments({
          receivedPayments: response.data.data.receivedPayments || [],
          pendingPayments: response.data.data.pendingPayments || [],
          totalPayments: response.data.data.totalPayments || 0,
          vendorId: response.data.data.vendorId,
          paymentMethod : response.data.paymentMethod,
          createdAt : response.data.createdAt
        });
      } else {
        throw new Error(
          response.data.message || "Failed to fetch payment data"
        );
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching payment data");
      toast.error(err.message || "Failed to load payment information");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    fetchPayments,
  };
};

export default useVendorPayments;
