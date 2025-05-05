import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/sidebar";
import ProdManage from "./prodManage";
import OrderManage from "./orderManage";
import InvenManage from "./invenManage";
import PromoManage from "./promoManage"; // Import PromoManage component

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
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2
                  className="text-7xl font-bold mb-4"
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
          <Route path="/promoManage" element={<PromoManage />} />{" "}
          {/* New Route */}
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
