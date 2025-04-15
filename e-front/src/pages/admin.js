import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/sidebar";
import ProdManage from "./prodManage";
import OrderManage from "./orderManage";
import InvenManage from "./invenManage";

const Admin = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Welcome to Admin Panel
                </h2>
                <p>Select an option from the left menu to manage the store.</p>
              </div>
            }
          />
          <Route path="/prodManage" element={<ProdManage />} />
          <Route path="/orderManage" element={<OrderManage />} />
          <Route path="/invenManage" element={<InvenManage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
