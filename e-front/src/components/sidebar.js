import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-black text-white p-6 flex flex-col">
      <NavLink to="/admin">
        <h1
          className="text-4xl font-bold mb-8 text-center hover:text-gray-300 transition"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          VibeWear
        </h1>
      </NavLink>

      <ul className="space-y-4">
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
    </div>
  );
};

export default Sidebar;
