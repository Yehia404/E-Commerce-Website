import React from "react";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="flex flex-col lg:flex-row lg:justify-between lg:items-center p-6 shadow-md gap-4">
      {/* Logo */}
      <div className="text-3xl font-extrabold text-center lg:text-left">
        VibeWear
      </div>

      {/* Nav Links */}
      <ul className="flex justify-center gap-16 text-sm lg:text-base">
        <li className="cursor-pointer">Shop</li>
        <li className="cursor-pointer">On Sale</li>
        <li className="cursor-pointer">New Arrivals</li>
        <li className="cursor-pointer">Brands</li>
      </ul>

      {/* Search + Icons */}
      <div className="flex items-center justify-center gap-6 w-full lg:w-auto">
        {/* Search Wrapper */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full lg:w-96 pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm border border-gray-300 focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <button className="text-xl">
          <FaUser />
        </button>
        <button className="text-xl">
          <FaShoppingCart />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
