import React from "react";
import { NavLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const Sidebar = () => {
  return (
    <div className="w-64 bg-black text-white p-6 flex flex-col h-screen">
      <NavLink to="/admin">
        <h1
          className="text-4xl font-bold mb-8 text-center hover:text-gray-300 transition"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          VibeWear
        </h1>
      </NavLink>

      {/* Main Menu */}
      <ul className="space-y-4 flex-grow">
        <li>
          <NavLink
            to="/admin/prodManage"
            className={({ isActive }) =>
              `block p-3 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            Product Management
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/orderManage"
            className={({ isActive }) =>
              `block p-3 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            Order Management
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/invenManage"
            className={({ isActive }) =>
              `block p-3 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            Inventory Management
          </NavLink>
        </li>
      </ul>

      {/* Bottom Link with Icon */}
      <div className="mt-4">
        <NavLink
          to="/"
          className="flex items-center justify-center gap-2 p-3 rounded hover:bg-gray-700 text-sm border-t border-gray-700 pt-4"
        >
          <FiArrowLeft className="text-lg" />
          Go to Website
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
