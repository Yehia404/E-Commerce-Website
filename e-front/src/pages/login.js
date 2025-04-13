import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
          <h2 className="text-2xl font-bold mb-6">Login</h2>

          <form className="w-2/3">
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border-b border-gray-400 py-2 focus:outline-none focus:border-black"
              />
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border-b border-gray-400 py-2 focus:outline-none focus:border-black"
              />
              {/* Eye icon (optional, static for now) */}
              <span className="absolute right-2 top-8 text-gray-500 cursor-pointer">
                👁️
              </span>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember Me
              </label>
              <a href="#" className="text-gray-600 hover:underline">
                Forgot Password
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="bg-black  text-white px-12 py-2 rounded-full"
            >
              Login
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            {/* <a href="#" className="text-black hover:underline">
            Sign up
          </a> */}
            <Link to="/register" className="text-blue-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 bg-black flex justify-center items-center">
          {
            <h1
              className="text-9xl text-white tracking-widest"
              style={{
                fontFamily: "Dancing Script, cursive",
                fontWeight: "700",
              }}
            >
              Vibewear
            </h1>

            /* <img
          src="your-image-path.png" // Replace this with your actual image path
          alt="Hey Design Studio"
          className="max-w-full h-auto"
        /> */
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}

// export default Login;
