import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import Password from "../components/password";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.firstName.length < 3) {
      newErrors.firstName = "First name must be at least 3 characters.";
    }

    if (formData.lastName.length < 3) {
      newErrors.lastName = "Last name must be at least 3 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!/^\d{11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 11 digits.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // handle actual form submission here
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center px-6 py-10">
          <h2 className="text-2xl font-bold mb-6">Register</h2>

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            {/* First Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-black"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-black"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-black"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-black"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <Password
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            {/* Register Button */}
            <button
              type="submit"
              className="bg-black text-white w-full py-2 rounded-full mt-4"
            >
              Register
            </button>
          </form>

          {/* Login link */}
          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Right Side - Image / Branding */}
        <div className="w-full md:w-1/2 bg-black flex justify-center items-center py-10">
          <h1
            className="text-6xl md:text-9xl text-white tracking-widest text-center"
            style={{ fontFamily: "Dancing Script, cursive", fontWeight: "700" }}
          >
            VibeWear
          </h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
