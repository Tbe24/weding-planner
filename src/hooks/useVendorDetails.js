import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { clientService } from "../services/api";
import { toast } from "react-toastify";

const useVendorDetails = () => {
  const { id } = useParams();
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicesByCategory, setServicesByCategory] = useState({});

  useEffect(() => {
    const fetchVendorDetails = async () => {
      setLoading(true);
      try {
        if (id) {
          // Fetch vendor by ID
          const response = await clientService.getVendorById(id);

          if (response.data && response.data.success && response.data.vendor) {
            // Get the vendor data from the response
            const vendor = response.data.vendor;

            // Store services by category
            setServicesByCategory(vendor.servicesByCategory || {});

            // Create packages from services
            const packages = [];
            Object.values(vendor.servicesByCategory || {}).forEach(
              (services) => {
                services.forEach((service) => {
                  // Parse features if it's a string
                  let features = [];
                  if (service.features) {
                    if (typeof service.features === "string") {
                      try {
                        features = JSON.parse(service.features);
                      } catch (e) {
                        console.error("Error parsing features:", e);
                        features = [];
                      }
                    } else if (Array.isArray(service.features)) {
                      features = service.features;
                    }
                  }

                  packages.push({
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    price: service.price,
                    features: features,
                    packageType: service.packageType || "Standard",
                    timeline: service.timeline || "Contact for timeline",
                    pricing:
                      service.pricing ||
                      `ETB ${service.price.toLocaleString()}`,
                    category: service.category?.name || "Other",
                  });
                });
              }
            );

            // Format the vendor data
            const formattedVendor = {
              id: vendor.id,
              name: vendor.businessName,
              ownerName: vendor.ownerName,
              email: vendor.contactEmail,
              phone: vendor.contactPhone,
              rating: vendor.rating || 0,
              serviceType: vendor.serviceType,
              location: "Addis Ababa, Ethiopia", // Default location
              packages: packages,
              servicesByCategory: vendor.servicesByCategory || {},
              reviews: vendor.reviews || [],
            };

            setVendorDetails(formattedVendor);
          } else {
            // Handle invalid response
            setError("Could not retrieve vendor details");
            toast.error("Could not retrieve vendor details");
          }
        } else {
          // No ID provided
          setError("Vendor ID is required");
          toast.error("Vendor ID is required");
        }
      } catch (err) {
        console.error("Error fetching vendor details:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching vendor details"
        );
        toast.error("Failed to load vendor details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [id]);

  return { vendorDetails, servicesByCategory, loading, error };
};

export default useVendorDetails;
