import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import useVendorDetails from "../hooks/useVendorDetails";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import BackButton from "../components/ui/BackButton";
import CartModal from "../components/service/CartModal";
import { useCartContext } from "../components/service/CartContext";
import { toast } from "react-toastify";

const Vendor = () => {
  const navigate = useNavigate();
  const { vendorDetails, loading, error } = useVendorDetails();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { addToCart } = useCartContext();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handlePackageSelect = (packageData) => {
    const cartItem = {
      id: packageData.id,
      type: "package",
      name: packageData.name,
      price: packageData.price,
      vendorId: vendorDetails.id,
      vendorName: vendorDetails.name,
      description: packageData.description,
    };

    addToCart(cartItem);
    toast.success(`${packageData.name} added to cart!`);
    setIsCartModalOpen(true);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <BackButton onClick={handleBackClick} text="Back to Vendors" />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <ErrorMessage title="Error Loading Vendor" message={error} />
          ) : vendorDetails ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
              {/* Vendor Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">
                  {vendorDetails.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{vendorDetails.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{vendorDetails.location}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{vendorDetails.phone || "No phone provided"}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{vendorDetails.email || "No email provided"}</span>
                  </div>
                </div>
              </div>

              {/* Vendor Info */}
              <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                      Vendor Information
                    </h2>
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Owner:</span>{" "}
                      {vendorDetails.ownerName}
                    </p>
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Service Type:</span>{" "}
                      {vendorDetails.serviceType}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Total Packages:</span>{" "}
                      {vendorDetails.packages.length}
                    </p>
                  </div>

                  <div className="md:w-2/3">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                      Contact Information
                    </h2>
                    <p className="text-gray-600 mb-2">
                      For inquiries about services or to schedule a
                      consultation, please contact:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 ml-2">
                      <li>Phone: {vendorDetails.phone || "Not provided"}</li>
                      <li>Email: {vendorDetails.email || "Not provided"}</li>
                      <li>Location: {vendorDetails.location}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Packages Section */}
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Available Packages
                </h2>

                {vendorDetails.packages && vendorDetails.packages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendorDetails.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div
                          className={`p-4 text-white ${
                            pkg.packageType?.toLowerCase() === "gold"
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                              : pkg.packageType?.toLowerCase() === "platinum"
                              ? "bg-gradient-to-r from-blue-400 to-blue-600"
                              : pkg.packageType?.toLowerCase() === "silver"
                              ? "bg-gradient-to-r from-gray-400 to-gray-600"
                              : "bg-gradient-to-r from-purple-500 to-purple-700"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">
                              {pkg.name}
                            </h3>
                            {pkg.packageType && (
                              <span className="text-xs font-bold px-2 py-1 bg-black bg-opacity-20 rounded-full">
                                {pkg.packageType}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-2xl font-bold">
                            ETB {pkg.price.toLocaleString()}
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="text-gray-600 mb-4">
                            {pkg.description}
                          </p>

                          {pkg.features && pkg.features.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Package Features:
                              </h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {pkg.features
                                  .slice(0, 5)
                                  .map((feature, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <svg
                                        className={`h-5 w-5 mr-2 flex-shrink-0 ${
                                          pkg.packageType?.toLowerCase() ===
                                          "gold"
                                            ? "text-yellow-500"
                                            : pkg.packageType?.toLowerCase() ===
                                              "platinum"
                                            ? "text-blue-600"
                                            : pkg.packageType?.toLowerCase() ===
                                              "silver"
                                            ? "text-gray-500"
                                            : "text-green-500"
                                        }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                {pkg.features.length > 5 && (
                                  <li
                                    className={`text-center text-xs mt-1 font-medium ${
                                      pkg.packageType?.toLowerCase() === "gold"
                                        ? "text-yellow-600"
                                        : pkg.packageType?.toLowerCase() ===
                                          "platinum"
                                        ? "text-blue-600"
                                        : pkg.packageType?.toLowerCase() ===
                                          "silver"
                                        ? "text-gray-600"
                                        : "text-purple-600"
                                    }`}
                                  >
                                    + {pkg.features.length - 5} more features
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                          {pkg.timeline && (
                            <div className="mb-4 text-sm">
                              <span className="font-medium text-gray-700">
                                Timeline:{" "}
                              </span>
                              <span className="text-gray-600">
                                {pkg.timeline}
                              </span>
                            </div>
                          )}

                          <button
                            onClick={() => handlePackageSelect(pkg)}
                            className={`w-full text-white py-3 rounded-lg transition-colors font-medium ${
                              pkg.packageType?.toLowerCase() === "gold"
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : pkg.packageType?.toLowerCase() === "platinum"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : pkg.packageType?.toLowerCase() === "silver"
                                ? "bg-gray-500 hover:bg-gray-600"
                                : "bg-purple-600 hover:bg-purple-700"
                            }`}
                          >
                            Book This Package
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                      No packages available from this vendor.
                    </p>
                  </div>
                )}
              </div>

              {/* Reviews Section - Removed since reviews are not available in the backend */}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Vendor Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                The vendor you're looking for could not be found.
              </p>
              <button
                onClick={() => navigate("/services")}
                className="px-6 py-2 bg-wedding-purple text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                Browse All Categories
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />

      <Footer />
    </>
  );
};

export default Vendor;
