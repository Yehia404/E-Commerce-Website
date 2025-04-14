import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import Password from "../components/password";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
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
      console.log("Logging in:", formData);
    } else {
      console.log("Validation failed.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
          <h2 className="text-2xl font-bold mb-6">Login</h2>

          <form className="w-2/3" onSubmit={handleSubmit}>
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

            {/* Password */}
            <Password
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember Me
              </label>
              <a href="#" className="hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="bg-black text-white px-12 py-2 rounded-full"
            >
              Login
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Right Side - Branding */}
        <div className="w-1/2 bg-black flex justify-center items-center">
          <h1
            className="text-9xl text-white tracking-widest"
            style={{
              fontFamily: "Dancing Script, cursive",
              fontWeight: "700",
            }}
          >
            Vibewear
          </h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
