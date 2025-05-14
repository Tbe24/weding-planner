import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { clientService } from "../services/api";
import { fallbackVendors } from "../data/fallbackServiceDetails";
import { toast } from "react-toastify";

const useVendorsByCategory = () => {
  const { categoryName } = useParams();
  const [vendors, setVendors] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendorsByCategory = async () => {
      setLoading(true);
      try {
        if (categoryName) {
          // Fetch vendors by category using the client vendors API
          const response = await clientService.getVendorsByCategory(
            categoryName
          );

          if (response.data && response.data.success) {
            // Set category data from the API response
            setCategory(response.data.category);

            // Transform the vendor data to match our component's expectations
            const formattedVendors = response.data.vendors.map((vendor) => ({
              id: vendor.id,
              name: vendor.businessName,
              rating: vendor.rating || 0,
              // Use the price of the first service or a default value
              pricing:
                vendor.services && vendor.services.length > 0
                  ? `Starting at ETB ${vendor.services[0].price.toLocaleString()}`
                  : "Contact for pricing",
              location: "Addis Ababa, Ethiopia", // Default location
              services: vendor.services || [],
              serviceCount: vendor.serviceCount || 0,
              email: vendor.email,
              phone: vendor.phone,
              ownerName: vendor.ownerName,
            }));

            setVendors(formattedVendors);
          } else {
            // Handle empty response
            console.log("No vendors found for this category");
            setVendors([]);
            toast.info(`No vendors found for ${categoryName} category`);
          }
        } else {
          // No category name provided
          setError("Category name is required");
          toast.error("Category name is required");
        }
      } catch (err) {
        console.error("Error fetching vendors by category:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching vendors"
        );
        toast.error("Failed to load vendors. Please try again later.");

        // Use fallback data on error in development environment
        if (process.env.NODE_ENV === "development") {
          console.log("Using fallback data in development mode");
          setVendors(fallbackVendors[categoryName] || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVendorsByCategory();
  }, [categoryName]);

  return { vendors, category, loading, error };
};

export default useVendorsByCategory;
