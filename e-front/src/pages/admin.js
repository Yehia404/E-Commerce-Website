import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/sidebar";
import ProdManage from "./prodManage";
import OrderManage from "./orderManage";
import InvenManage from "./invenManage";
import PromoManage from "./promoManage";
import { MenuOutlined } from "@ant-design/icons";

const Admin = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      // Auto-close sidebar when transitioning to desktop
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleContentClick = () => {
    if (isMobileView && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Menu Button - now conditional on sidebar being closed */}
      {isMobileView && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded-md shadow-lg"
          aria-label="Toggle menu"
        >
          <MenuOutlined className="text-xl" />
        </button>
      )}

      {/* Sidebar - conditionally rendered based on view/state */}
      <div
        className={`${
          isMobileView
            ? `fixed inset-y-0 left-0 z-40 w-64 transition-transform transform duration-300 ease-in-out ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "w-64 min-w-[16rem] flex-shrink-0" // Added flex-shrink-0 to prevent shrinking
        }`}
      >
        <Sidebar
          closeSidebar={() => setSidebarOpen(false)}
          isMobile={isMobileView}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobileView && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          isMobileView ? "w-full" : ""
        }`}
        onClick={handleContentClick}
      >
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className={`pb-20 ${isMobileView ? "pt-16" : ""}`}>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="flex flex-col items-center justify-center h-full text-center mt-10">
                    <h2
                      className="text-4xl md:text-7xl font-bold mb-4"
                      style={{ fontFamily: "Dancing Script, cursive" }}
                    >
                      Welcome to Admin Panel
                    </h2>
                  </div>
                }
              />
              <Route path="/prodManage" element={<ProdManage />} />
              <Route path="/orderManage" element={<OrderManage />} />
              <Route path="/invenManage" element={<InvenManage />} />
              <Route path="/promoManage" element={<PromoManage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
