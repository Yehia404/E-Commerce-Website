import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      console.log("Passwords do not match!");
    } else {
      // Submit form data here
      console.log(formData);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
          <h2 className="text-2xl font-bold mb-6">Register</h2>

          {/* Form Container without Border */}
          <form onSubmit={handleSubmit} className="w-2/3">
            {/* First Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-black"
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-black"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-black"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-black"
              />
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <label className="block text-gray-700  text-sm mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-black"
              />
              <span className="absolute right-2 top-8 text-gray-500 cursor-pointer">👁️</span>
            </div>

            {/* Confirm Password
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-black"
              />
            </div> */}

            {/* Register Button */}
            <button type="submit" className="bg-black text-white px-12 py-2 rounded-full">
              Register
            </button>
          </form>

          {/* Login link */}
          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-700 hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 bg-black flex justify-center items-center">
          <h1
            className="text-9xl text-white tracking-widest"
            style={{ fontFamily: 'Dancing Script, cursive', fontWeight: '700' }}
          >
            Vibewear
          </h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};
