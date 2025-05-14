import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import BackButton from "../components/ui/BackButton";
import useVendorsByCategory from "../hooks/useVendorsByCategory";

const VendorsByCategory = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const { vendors, category, loading, error } = useVendorsByCategory();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <BackButton onClick={handleBackClick} text="Back to Categories" />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <ErrorMessage title="Error Loading Vendors" message={error} />
          ) : (
            <>
              <div className="text-center mb-10 mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {category?.name || categoryName || "Vendors"}
                </h1>
                <div className="w-16 h-1 bg-wedding-purple mx-auto my-4"></div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {category?.description ||
                    `Browse our selection of top-rated ${categoryName} vendors offering quality services for your special day.`}
                </p>
              </div>

              {vendors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendors.map((vendor) => (
                    <Link
                      key={vendor.id}
                      to={`/vendor/${vendor.id}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                    >
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-xl font-semibold text-gray-800">
                            {vendor.name}
                          </h2>
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="text-gray-700">
                              {vendor.rating ? vendor.rating.toFixed(1) : "New"}
                            </span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Owner:</span>{" "}
                            {vendor.ownerName}
                          </p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Email:</span>{" "}
                            {vendor.email}
                          </p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Phone:</span>{" "}
                            {vendor.phone || "Not provided"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {vendor.services && vendor.services.length > 0 && (
                            <>
                              {vendor.services.slice(0, 2).map((service) => {
                                // Determine card background color based on package type
                                const bgColorClass =
                                  service.packageType?.toLowerCase() === "gold"
                                    ? "bg-yellow-50 border-yellow-200"
                                    : service.packageType?.toLowerCase() ===
                                      "platinum"
                                    ? "bg-blue-50 border-blue-200"
                                    : service.packageType?.toLowerCase() ===
                                      "silver"
                                    ? "bg-gray-100 border-gray-200"
                                    : "bg-purple-50 border-purple-200";

                                // Determine text color based on package type
                                const textColorClass =
                                  service.packageType?.toLowerCase() === "gold"
                                    ? "text-yellow-800"
                                    : service.packageType?.toLowerCase() ===
                                      "platinum"
                                    ? "text-blue-800"
                                    : service.packageType?.toLowerCase() ===
                                      "silver"
                                    ? "text-gray-800"
                                    : "text-purple-800";

                                return (
                                  <div
                                    key={service.id}
                                    className={`rounded-lg p-3 mb-3 border ${bgColorClass}`}
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <span
                                        className={`font-medium ${textColorClass}`}
                                      >
                                        {service.name}
                                      </span>
                                      {service.packageType && (
                                        <span
                                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                            service.packageType.toLowerCase() ===
                                            "gold"
                                              ? "bg-yellow-200 text-yellow-800"
                                              : service.packageType.toLowerCase() ===
                                                "platinum"
                                              ? "bg-blue-200 text-blue-800"
                                              : service.packageType.toLowerCase() ===
                                                "silver"
                                              ? "bg-gray-300 text-gray-800"
                                              : "bg-purple-200 text-purple-800"
                                          }`}
                                        >
                                          {service.packageType}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-gray-600">
                                        {service.features &&
                                        service.features.length > 0
                                          ? `${service.features.length} features`
                                          : "No features"}
                                      </span>
                                      <span
                                        className={`font-medium ${textColorClass}`}
                                      >
                                        ETB {service.price.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}

                              {vendor.services.length > 2 && (
                                <div className="text-center text-xs mt-1 text-purple-600">
                                  + {vendor.services.length - 2} more services
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-purple-600 font-medium">
                            {vendor.pricing}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {vendor.location}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    No Vendors Found
                  </h2>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any vendors in the {categoryName} category.
                  </p>
                  <button
                    onClick={() => navigate("/services")}
                    className="px-6 py-2 bg-wedding-purple text-white rounded-full hover:bg-purple-700 transition-colors"
                  >
                    Browse All Categories
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default VendorsByCategory;
