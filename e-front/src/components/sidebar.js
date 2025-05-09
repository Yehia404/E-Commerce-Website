import React from "react";
import { NavLink } from "react-router-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  DatabaseOutlined,
  TagOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const Sidebar = ({ closeSidebar, isMobile }) => {
  const handleLinkClick = () => {
    // Only close sidebar on link click if on mobile
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <div className="h-full bg-black text-white flex flex-col">
      {/* Header with logo and close button for mobile */}
      <div className="p-4 flex items-center justify-between">
        <NavLink to="/admin" onClick={handleLinkClick}>
          <h1
            className="text-2xl md:text-3xl font-bold text-center hover:text-gray-300 transition"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            VibeWear
          </h1>
        </NavLink>

        {isMobile && (
          <button
            onClick={closeSidebar}
            className="text-white p-1 rounded hover:bg-gray-800"
            aria-label="Close menu"
          >
            <FiX className="text-xl" />
          </button>
        )}
      </div>

      {/* Main Menu */}
      <div className="flex-grow px-4 py-6 overflow-y-auto">
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin/prodManage"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded hover:bg-gray-700 transition-colors ${
                    isActive ? "bg-gray-800" : ""
                  }`
                }
                onClick={handleLinkClick}
              >
                <ShoppingOutlined className="mr-3 text-lg" />
                <span>Product Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/orderManage"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded hover:bg-gray-700 transition-colors ${
                    isActive ? "bg-gray-800" : ""
                  }`
                }
                onClick={handleLinkClick}
              >
                <ShoppingCartOutlined className="mr-3 text-lg" />
                <span>Order Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/invenManage"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded hover:bg-gray-700 transition-colors ${
                    isActive ? "bg-gray-800" : ""
                  }`
                }
                onClick={handleLinkClick}
              >
                <DatabaseOutlined className="mr-3 text-lg" />
                <span>Inventory Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/promoManage"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded hover:bg-gray-700 transition-colors ${
                    isActive ? "bg-gray-800" : ""
                  }`
                }
                onClick={handleLinkClick}
              >
                <TagOutlined className="mr-3 text-lg" />
                <span>PromoCode Management</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Link */}
      <div className="p-4 border-t border-gray-700">
        <NavLink
          to="/"
          className="flex items-center justify-center gap-2 p-3 rounded hover:bg-gray-700 transition-colors text-sm"
          onClick={handleLinkClick}
        >
          <FiArrowLeft className="text-lg" />
          <span>Go to Website</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
