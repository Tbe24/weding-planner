import React from "react";
import useSignUpForm from "../../hooks/useSignUpForm";
import useServiceCategories from "../../hooks/useServiceCategories";
import Button from "../ui/Button";
import PhoneInput from "../ui/PhoneInput";

const SignUpForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
  } = useSignUpForm();

  // Fetch service categories from the backend
  const { categories, loading: categoriesLoading } = useServiceCategories();

  return (
    <>
      {isSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          Account created successfully! You can now sign in.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name Field */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                      ${
                        errors.firstName
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-purple-200 focus:border-purple-400"
                      }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name Field */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                      ${
                        errors.lastName
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-purple-200 focus:border-purple-400"
                      }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                      ${
                        errors.email
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-purple-200 focus:border-purple-400"
                      }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone Number Field with Ethiopian Flag */}
        <PhoneInput
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          name="phone"
        />

        {/* User Role Selection */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            I want to register as
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`border p-4 rounded-lg cursor-pointer text-center transition-colors
                ${
                  formData.role === "CLIENT"
                    ? "bg-purple-100 border-purple-500"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() =>
                handleChange({ target: { name: "role", value: "CLIENT" } })
              }
            >
              <span className="text-md font-medium">Client</span>
              <p className="text-xs text-gray-600 mt-1">
                Book services for your events
              </p>
            </div>

            <div
              className={`border p-4 rounded-lg cursor-pointer text-center transition-colors
                ${
                  formData.role === "VENDOR"
                    ? "bg-purple-100 border-purple-500"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() =>
                handleChange({ target: { name: "role", value: "VENDOR" } })
              }
            >
              <span className="text-md font-medium">Vendor</span>
              <p className="text-xs text-gray-600 mt-1">
                Offer services for events
              </p>
            </div>
          </div>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        {/* Business Information Fields (only shown when role is VENDOR) */}
        {formData.role === "VENDOR" && (
          <>
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                          ${
                            errors.businessName
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:ring-purple-200 focus:border-purple-400"
                          }`}
                placeholder="Enter your business name"
              />
              <p className="mt-1 text-xs text-gray-500">
                Business name must be at least 3 characters for payment
                processing.
              </p>
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.businessName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="serviceType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Type
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                          ${
                            errors.serviceType
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:ring-purple-200 focus:border-purple-400"
                          }`}
              >
                <option value="">Select service type</option>
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Photography">Photography</option>
                <option value="Decoration">Decoration</option>
                <option value="Music">Music & Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </select>
              {errors.serviceType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.serviceType}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                          ${
                            errors.categoryId
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:ring-purple-200 focus:border-purple-400"
                          }`}
                disabled={categoriesLoading}
              >
                <option value="">Select service category</option>
                {categoriesLoading ? (
                  <option value="" disabled>
                    Loading categories...
                  </option>
                ) : (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
              )}
            </div>

            {/* Account Number Field */}
            <div>
              <label
                htmlFor="accountNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CBE Account Number
              </label>
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                value={formData.accountNumber || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                          ${
                            errors.accountNumber
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:ring-purple-200 focus:border-purple-400"
                          }`}
                placeholder="Enter 13-digit CBE account number"
              />
              <p className="mt-1 text-xs text-gray-500">
                CBE account must be exactly 13 digits for payment processing.
              </p>
              {errors.accountNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.accountNumber}
                </p>
              )}
            </div>

            {/* TIN Number Field */}
            <div>
              <label
                htmlFor="tinNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                TIN Number
              </label>
              <input
                id="tinNumber"
                name="tinNumber"
                type="text"
                value={formData.tinNumber || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                          ${
                            errors.tinNumber
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:ring-purple-200 focus:border-purple-400"
                          }`}
                placeholder="Enter 10-digit TIN number"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter your 10-digit Tax Identification Number (TIN) issued by
                the Ethiopian Revenue and Customs Authority.
              </p>
              {errors.tinNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.tinNumber}</p>
              )}
            </div>
          </>
        )}

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                      ${
                        errors.password
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-purple-200 focus:border-purple-400"
                      }`}
            placeholder="Create a password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                      ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-purple-200 focus:border-purple-400"
                      }`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            text={isSubmitting ? "Creating Account..." : "Sign Up"}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300"
          />
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Sign In
            </a>
          </p>
        </div>
      </form>
    </>
  );
};

export default SignUpForm;
